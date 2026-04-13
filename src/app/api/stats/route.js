import { NextResponse } from 'next/server';
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. AJUSTE DE FUSO HORÁRIO (Brasília UTC-3)
    const agoraUTC = new Date();
    const agoraBR = new Date(agoraUTC.getTime() - (3 * 60 * 60 * 1000));
    
    const horaAtual = agoraBR.getUTCHours();
    const diaAtualStr = agoraBR.toISOString().split('T')[0]; // YYYY-MM-DD

    // Definição do Turno Alvo com base na hora atual de Brasília
    // Diurno: 06:00 às 17:59 | Noturno: 18:00 às 05:59
    const turnoAlvo = (horaAtual >= 6 && horaAtual < 18) ? "DIURNO" : "NOTURNO";

    // Início do dia para busca no banco (00:00:00 UTC)
    const inicioDia = new Date(agoraBR);
    inicioDia.setUTCHours(0, 0, 0, 0);

    // 2. BUSCAR RELATÓRIOS DO DIA
    const relatoriosDoDia = await prisma.relatorio.findMany({
      where: { 
        createdAt: { gte: inicioDia } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Se não houver nenhum relatório no dia
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
    
    // 3. LÓGICA DE PENDÊNCIA REFINADA
    // Convertemos a hora do relatório para o fuso BR para comparar
    let isPendente = true;

    const relatoriosComTurno = relatoriosDoDia.map(rel => {
      const dataRel = new Date(rel.createdAt);
      const dataRelBR = new Date(dataRel.getTime() - (3 * 60 * 60 * 1000));
      const horaRelBR = dataRelBR.getUTCHours();
      
      // Atribui a qual turno esse relatório pertence
      const turnoDoRelatorio = (horaRelBR >= 6 && horaRelBR < 18) ? "DIURNO" : "NOTURNO";
      return { ...rel, turnoDoRelatorio };
    });

    // Verifica se existe algum relatório feito DENTRO do turno alvo atual
    const jaFeitoNoTurno = relatoriosComTurno.some(rel => rel.turnoDoRelatorio === turnoAlvo);
    
    if (jaFeitoNoTurno) {
      isPendente = false;
    }

    // --- DICIONÁRIOS DE STATUS (Mantidos) ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0, cautelasCount = 0, reservaCount = 0;
    let historico = [];
    const itensProcessadosNoLog = new Set();

    // 4. PROCESSAMENTO DOS ITENS (Sempre baseado no último relatório enviado)
    const itensUltimo = Array.isArray(ultimoRelatorio.itens) 
      ? ultimoRelatorio.itens 
      : JSON.parse(ultimoRelatorio.itens || "[]");

    itensUltimo.forEach(item => {
      const obsRaw = (item.cautela || "").trim();
      const obsUpper = obsRaw.toUpperCase();
      const itemID = (item.serie || item.pmpr || item.desc || "SEM-ID").trim();

      const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));
      const ehDano = termosDanos.some(t => obsUpper.includes(t));
      const ehManutencao = termosManutencao.some(t => obsUpper.includes(t));
      const ehExtravio = termosExtravio.some(t => obsUpper.includes(t));
      const ehTecnico = ehDano || ehManutencao || ehExtravio;

      if (ehEstoque) reservaCount++;
      else if (ehTecnico) avariasCount++;
      else cautelasCount++;

      if (!ehEstoque) {
        itensProcessadosNoLog.add(itemID);
        let statusFinal = "CAUTELADO";
        if (ehDano) statusFinal = "CRÍTICO";
        if (ehManutencao) statusFinal = "MANUTENÇÃO";
        if (ehExtravio) statusFinal = "EXTRAVIO";

        historico.push({
          id: itemID,
          equipamento: item.desc || "Equipamento",
          militar: obsRaw, 
          livro: item.pagLivro || "---",
          status: statusFinal,
          hora: ultimoRelatorio.hora,
          responsavel: ultimoRelatorio.responsavel
        });
      }
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
        aderencia: isPendente ? "PENDENTE" : "REALIZADO",
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