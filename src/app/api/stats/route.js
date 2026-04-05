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

    // Buscamos os relatórios do dia, do mais recente para o mais antigo
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

    // --- SUPER DICIONÁRIO ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'FURRIELACAO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'AMASSADO', 'INOPERANTE', 'QUEBRADA', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'LIMPEZA', 'OFICINA', 'CONSERTO', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO'];

    let avariasCount = 0, cautelasCount = 0, reservaCount = 0;
    let historico = [];
    
    // Este Set garantirá que cada item (Pistola, Chave, etc) só apareça UMA VEZ no log (a mais recente)
    const itensProcessadosNoLog = new Set();

    relatoriosDoDia.forEach(rel => {
      const itensArray = Array.isArray(rel.itens) 
        ? rel.itens 
        : (typeof rel.itens === 'string' ? JSON.parse(rel.itens) : []);

      itensArray.forEach(item => {
        const obsRaw = (item.cautela || "").trim();
        const obsUpper = obsRaw.toUpperCase();
        
        // Chave única do item para evitar duplicidade entre turnos
        const itemID = (item.serie || item.pmpr || item.desc || "SEM-ID").trim();

        const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));
        const ehDano = termosDanos.some(t => obsUpper.includes(t));
        const ehManutencao = termosManutencao.some(t => obsUpper.includes(t));
        const ehExtravio = termosExtravio.some(t => obsUpper.includes(t));
        const ehTecnico = ehDano || ehManutencao || ehExtravio;

        // 1. CONTAGEM DOS CARDS: Baseado EXCLUSIVAMENTE no último relatório enviado (O estado agora)
        if (rel.id === ultimoRelatorio.id) {
          if (ehEstoque) reservaCount++;
          else if (ehTecnico) avariasCount++;
          else cautelasCount++;
        }

        // 2. LÓGICA DO LOG (DIREITA): Evita duplicidade se o status for o mesmo do turno anterior
        // Só entra no log se não for estoque e se esse item específico ainda não apareceu na lista
        if (!ehEstoque && !itensProcessadosNoLog.has(itemID)) {
          
          itensProcessadosNoLog.add(itemID); // Bloqueia esse item para relatórios mais antigos do mesmo dia

          let statusFinal = "CAUTELADO";
          if (ehDano) statusFinal = "CRÍTICO";
          if (ehManutencao) statusFinal = "MANUTENÇÃO";
          if (ehExtravio) statusFinal = "EXTRAVIO";

          historico.push({
            id: itemID,
            equipamento: item.desc || "Item",
            militar: obsRaw, 
            livro: item.pagLivro || "---",
            status: statusFinal,
            hora: rel.hora,
            responsavel: rel.responsavel
          });
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
        aderencia: isPendente ? "PENDENTE" : "100%",
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