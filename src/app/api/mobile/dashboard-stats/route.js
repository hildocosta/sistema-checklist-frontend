import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

// Inicializa o Prisma Client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    // 1. Define o turno operacional alvo (DIURNO: 06h às 18h | NOTURNO: 18h às 06h)
    const turnoAlvo = (horaAtual >= 6 && horaAtual < 18) ? "DIURNO" : "NOTURNO";

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    // 2. Busca relatórios registrados hoje no banco de dados
    const relatoriosDoDia = await prisma.relatorio.findMany({
      where: { 
        createdAt: { gte: inicioDia } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Caso não exista nenhum checklist registrado hoje
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
    
    // 3. Lógica de pendência: Verifica se o último checklist bate com o turno atual
    let isPendente = true;
    if (turnoAlvo === "DIURNO" && (horaRel >= 6 && horaRel < 18)) isPendente = false;
    if (turnoAlvo === "NOTURNO" && (horaRel >= 18 || horaRel < 6)) isPendente = false;

    // --- DICIONÁRIOS DE FILTRO PARA IDENTIFICAÇÃO DE STATUS ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0;
    let cautelasCount = 0;
    let reservaCount = 0;
    let historico = [];

    // 4. Processar itens do último checklist para as estatísticas do Mobile
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

      // Classificação para os Cards do Dashboard
      if (ehEstoque) {
        reservaCount++;
      } else if (ehTecnico) {
        avariasCount++;
      } else {
        cautelasCount++;
      }

      // Se for uma alteração (não for estoque), adiciona ao log de ocorrências
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

    // 5. Resposta JSON formatada para o App Mobile
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
    console.error("Erro na API Dashboard Mobile:", error);
    return NextResponse.json(
      { error: "Erro ao processar dados do batalhão" }, 
      { status: 500 }
    );
  } finally {
    // Opcional: Desconecta o prisma se necessário (em Serverless o Next lida bem com isso)
    await prisma.$disconnect();
  }
}