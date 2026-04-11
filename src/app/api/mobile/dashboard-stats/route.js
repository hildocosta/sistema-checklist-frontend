import { NextResponse } from 'next/server';
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    // 1. Define o turno operacional alvo
    const turnoAlvo = (horaAtual >= 6 && horaAtual < 18) ? "DIURNO" : "NOTURNO";

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    // 2. Buscar relatórios registrados hoje
    const relatoriosDoDia = await prisma.relatorio.findMany({
      where: { 
        createdAt: { gte: inicioDia } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Caso não exista nenhum checklist hoje
    if (relatoriosDoDia.length === 0) {
      return NextResponse.json({ 
        isPendente: true, 
        turnoAlvo,
        ultimoChecklist: { responsavel: "NENHUM REGISTRO", hora: "--:--", data: "--/--/----" },
        stats: { aderencia: "PENDENTE", avarias: 0, emCautela: 0, reserva: 0 },
        logs: [] 
      });
    }

    const ultimoRelatorio = relatoriosDoDia[0];
    const dataRelatorio = new Date(ultimoRelatorio.createdAt);
    const horaRel = dataRelatorio.getHours();
    
    // 3. Lógica de pendência baseada no horário do último checklist
    let isPendente = true;
    if (turnoAlvo === "DIURNO" && (horaRel >= 6 && horaRel < 18)) isPendente = false;
    if (turnoAlvo === "NOTURNO" && (horaRel >= 18 || horaRel < 6)) isPendente = false;

    // --- DICIONÁRIOS DE FILTRO ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0, cautelasCount = 0, reservaCount = 0;
    let historico = [];

    // 4. Processar itens do último checklist para os Cards do Mobile
    const itens = Array.isArray(ultimoRelatorio.itens) 
      ? ultimoRelatorio.itens 
      : JSON.parse(ultimoRelatorio.itens || "[]");

    itens.forEach(item => {
      const obsRaw = (item.cautela || "").trim();
      const obsUpper = obsRaw.toUpperCase();
      const itemID = (item.serie || item.pmpr || item.desc || "S/ID").trim();

      const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));
      const ehDano = termosDanos.some(t => obsUpper.includes(t));
      const ehManutencao = termosManutencao.some(t => obsUpper.includes(t));
      const ehExtravio = termosExtravio.some(t => obsUpper.includes(t));
      const ehTecnico = ehDano || ehManutencao || ehExtravio;

      // Contagem para os Cards do Mobile
      if (ehEstoque) reservaCount++;
      else if (ehTecnico) avariasCount++;
      else cautelasCount++;

      // Se tiver alteração (não for estoque), manda para o Log
      if (!ehEstoque) {
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

    // 5. Retorno formatado para o Dashboard Mobile
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
      logs: historico
    });

  } catch (error) {
    console.error("Erro Dashboard Mobile:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" }, 
      { status: 500 }
    );
  }
}