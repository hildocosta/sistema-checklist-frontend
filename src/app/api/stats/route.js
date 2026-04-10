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

    // 1. Buscar relatórios do dia
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
    const dataRelatorio = new Date(ultimoRelatorio.createdAt);
    const horaRel = dataRelatorio.getHours();
    
    // Lógica de pendência
    let isPendente = true;
    if (turnoAlvo === "DIURNO" && (horaRel >= 6 && horaRel < 18)) isPendente = false;
    if (turnoAlvo === "NOTURNO" && (horaRel >= 18 || horaRel < 6)) isPendente = false;

    // --- DICIONÁRIOS DE STATUS ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0, cautelasCount = 0, reservaCount = 0;
    let historico = [];
    const itensProcessadosNoLog = new Set();

    // 2. PROCESSAMENTO PRIORITÁRIO: Itens do último checklist (Cards e Log Principal)
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

      // Contagem para os Cards
      if (ehEstoque) reservaCount++;
      else if (ehTecnico) avariasCount++;
      else cautelasCount++;

      // Adicionar ao Log se não for estoque
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

    // 3. COMPLEMENTO: Buscar movimentações de outros checklists do mesmo dia
    // (Caso algum item tenha sido cautelado de manhã e não apareça no checklist de agora)
    relatoriosDoDia.slice(1).forEach(rel => {
      const itensArray = Array.isArray(rel.itens) ? rel.itens : JSON.parse(rel.itens || "[]");
      
      itensArray.forEach(item => {
        const obsRaw = (item.cautela || "").trim();
        const itemID = (item.serie || item.pmpr || item.desc || "SEM-ID").trim();
        const obsUpper = obsRaw.toUpperCase();
        const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));

        if (!ehEstoque && !itensProcessadosNoLog.has(itemID)) {
          itensProcessadosNoLog.add(itemID);
          
          let statusFinal = "CAUTELADO";
          if (termosDanos.some(t => obsUpper.includes(t))) statusFinal = "CRÍTICO";
          if (termosManutencao.some(t => obsUpper.includes(t))) statusFinal = "MANUTENÇÃO";
          if (termosExtravio.some(t => obsUpper.includes(t))) statusFinal = "EXTRAVIO";

          historico.push({
            id: itemID,
            equipamento: item.desc || "Equipamento",
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