import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    // 1. Define qual turno o sistema ESPERA no momento atual
    const turnoEsperadoAgora = (horaAtual >= 6 && horaAtual < 18) ? "DIURNO" : "NOTURNO";

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    // 2. Busca os relatórios de hoje
    const relatoriosDoDia = await prisma.relatorio.findMany({
      where: { 
        createdAt: { gte: inicioDia } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Se não houver nenhum registro hoje, está pendente
    if (relatoriosDoDia.length === 0) {
      return NextResponse.json({ 
        isPendente: true, 
        turnoAlvo: turnoEsperadoAgora,
        ultimoChecklist: { responsavel: "NENHUM REGISTRO", hora: "--:--", data: "--/--/----" },
        stats: { aderencia: "PENDENTE", avarias: 0, emCautela: 0, reserva: 0 },
        logs: [] 
      });
    }

    const ultimoRelatorio = relatoriosDoDia[0];
    const dataRelatorio = new Date(ultimoRelatorio.createdAt);
    const horaRel = dataRelatorio.getHours();
    
    // 3. Identifica a qual turno pertence o ÚLTIMO relatório enviado
    const turnoDoRelatorio = (horaRel >= 6 && horaRel < 18) ? "DIURNO" : "NOTURNO";
    
    // LÓGICA DE PENDÊNCIA: 
    // Se o turno que o sistema espera agora é diferente do turno do último relatório enviado, está pendente.
    // Ex: Agora é 18:33 (NOTURNO) e o último foi 17:51 (DIURNO). NOTURNO !== DIURNO = PENDENTE.
    const isPendente = turnoEsperadoAgora !== turnoDoRelatorio;

    // --- DICIONÁRIOS DE FILTRO ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0;
    let cautelasCount = 0;
    let reservaCount = 0;
    let historico = [];

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

      if (ehEstoque) {
        reservaCount++;
      } else if (ehTecnico) {
        avariasCount++;
      } else {
        cautelasCount++;
      }

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

    return NextResponse.json({
      isPendente,
      turnoAlvo: isPendente ? turnoEsperadoAgora : turnoDoRelatorio,
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
    console.error("Erro na API Dashboard Mobile:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}