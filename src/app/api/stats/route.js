import { NextResponse } from 'next/server';
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const turnoAlvo = (horaAtual >= 6 && horaAtual < 18) ? "DIURNO" : "NOTURNO";

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const relatoriosDoDia = await prisma.relatorio.findMany({
      where: { createdAt: { gte: inicioDia } },
      orderBy: { createdAt: 'desc' }
    });

    if (relatoriosDoDia.length === 0) {
      return NextResponse.json({ 
        isPendente: true, 
        turnoAlvo,
        ultimoChecklist: { responsavel: "NENHUM REGISTRO", hora: "--:--", data: "--/--/----" },
        stats: { aderencia: "PENDENTE", avarias: 0, emCautela: 0, reserva: 0 },
        grafico: [],
        logs: [] 
      });
    }

    const ultimoRelatorio = relatoriosDoDia[0];
    const horaRel = new Date(ultimoRelatorio.createdAt).getHours();
    
    let isPendente = true;
    if (turnoAlvo === "DIURNO" && (horaRel >= 6 && horaRel < 18)) isPendente = false;
    if (turnoAlvo === "NOTURNO" && (horaRel >= 18 || horaRel < 6)) isPendente = false;

    // --- SUPER DICIONÁRIO DE CLASSIFICAÇÃO ---
    const termosEstoque = [
      'OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 
      'FURRIELAÇÃO', 'FURRIELACAO', 'NO ARMARIO', 'NO ARMÁRIO', 'PRONTO'
    ];

    const termosDanos = [
      'DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'AMASSADO', 
      'TRINCADO', 'FALHANDO', 'INOPERANTE', 'COM DEFEITO', 'QUEBRADA', 'DANO',
      'ESTILHAÇADO', 'ROMPIID', 'ESTOURADO', 'SEM FUNCIONAMENTO', 'DETERIORADO'
    ];

    const termosManutencao = [
      'MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'LIMPEZA', 'OFICINA', 
      'CONSERTO', 'REPARO', 'ARMARIA', 'NA ARMARIA', 'PROJETO', 'LABORATÓRIO',
      'CALIBRAGEM', 'RECARGA', 'CARREGANDO', 'MECÂNICO', 'EM TESTE'
    ];

    const termosExtravio = [
      'EXTRAVIO', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA',
      'SUBTRAIDO', 'ROUBADO', 'FURTADO', 'DESAPARECIDO', 'EM FALTA', 'AUSENTE'
    ];

    let avariasCount = 0, cautelasCount = 0, reservaCount = 0;
    let historico = [];
    const processados = new Set();

    relatoriosDoDia.forEach(rel => {
      const itensArray = Array.isArray(rel.itens) 
        ? rel.itens 
        : (typeof rel.itens === 'string' ? JSON.parse(rel.itens) : []);

      itensArray.forEach(item => {
        const obsRaw = (item.cautela || "").trim();
        const obsUpper = obsRaw.toUpperCase();
        const pagLivro = (item.pagLivro || "").trim();

        // Identificação de Categorias
        const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));
        const ehDano = termosDanos.some(t => obsUpper.includes(t));
        const ehManutencao = termosManutencao.some(t => obsUpper.includes(t));
        const ehExtravio = termosExtravio.some(t => obsUpper.includes(t));
        const ehTecnico = ehDano || ehManutencao || ehExtravio;

        // 1. LÓGICA DE CONTAGEM (Apenas do último relatório para os cards superiores)
        if (rel.id === ultimoRelatorio.id) {
          if (ehEstoque) {
            reservaCount++;
          } else if (ehTecnico) {
            avariasCount++; // Chave danificada agora soma aqui!
          } else {
            cautelasCount++; // Apenas nomes de militares somam aqui
          }
        }

        // 2. LÓGICA DO MOTOR DE BUSCA (Logs da direita)
        if (!ehEstoque) {
          const logKey = `${item.serie}-${obsUpper}-${pagLivro}`;
          
          if (!processados.has(logKey)) {
            processados.add(logKey);

            // Define o Status Visual do Log
            let statusFinal = "CAUTELADO";
            if (ehDano) statusFinal = "CRÍTICO";
            if (ehManutencao) statusFinal = "MANUTENÇÃO";
            if (ehExtravio) statusFinal = "EXTRAVIO";

            historico.push({
              id: item.serie || item.pmpr || "S/N",
              equipamento: item.desc || "Item",
              militar: obsRaw, 
              livro: pagLivro,
              status: statusFinal,
              hora: rel.hora,
              responsavel: rel.responsavel
            });
          }
        }
      });
    });

    return NextResponse.json({
      isPendente,
      turnoAlvo,
      ultimoChecklist: {
        data: ultimoRelatorio.data,
        hora: ultimoRelatorio.hora,
        responsavel: ultimoRelatorio.responsavel
      },
      stats: {
        aderencia: isPendente ? "EXPIRADO" : "100%",
        avarias: avariasCount,
        emCautela: cautelasCount,
        reserva: reservaCount,
      },
      grafico: [
        { name: 'Disponível', valor: reservaCount, fill: isPendente ? '#cbd5e1' : '#10b981' },
        { name: 'Cautela', valor: cautelasCount, fill: '#0284c7' },
        { name: 'Avaria', valor: avariasCount, fill: '#ef4444' }
      ],
      logs: historico
    });

  } catch (e) {
    console.error("Erro na API Stats:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}