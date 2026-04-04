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

    const termosEstoque = ['DISPONÍVEL', 'DISPONIVEL', 'FURRIELAÇÃO', 'OK', '---', 'RESERVA'];
    const termosAvaria = ['AVARIA', 'DEFEITO', 'EXTRAVIO', 'QUEBRADO', 'DANIFICADO', 'MANUTENÇÃO'];

    let avarias = 0, cautelas = 0, reserva = 0;
    let historico = [];
    const processados = new Set();

    relatoriosDoDia.forEach(rel => {
      // CORREÇÃO CRÍTICA: Garante que rel.itens seja um Array
      const itensArray = Array.isArray(rel.itens) 
        ? rel.itens 
        : (typeof rel.itens === 'string' ? JSON.parse(rel.itens) : []);

      itensArray.forEach(item => {
        const obsRaw = (item.cautela || "").trim();
        const obsUpper = obsRaw.toUpperCase();
        const pagLivro = (item.pagLivro || "").trim();

        // Lógica de Contagem (Apenas para o último relatório)
        if (rel.id === ultimoRelatorio.id) {
          if (!obsRaw || termosEstoque.some(t => obsUpper.includes(t))) {
            reserva++; // Aqui ele vai contar os 96 itens do seu PDF
          } else {
            const temAvaria = termosAvaria.some(t => obsUpper.includes(t));
            if (temAvaria) avarias++; else cautelas++;
          }
        }

        // Lógica do Motor de Busca (Histórico na Íntegra)
        // Só adiciona ao log se não for item de estoque (ou seja, se for novidade)
        if (obsRaw && !termosEstoque.some(t => obsUpper.includes(t))) {
          const logKey = `${item.serie}-${obsUpper}-${pagLivro}`;
          if (!processados.has(logKey)) {
            processados.add(logKey);
            historico.push({
              id: item.serie || item.pmpr || "S/N",
              equipamento: item.desc || "Item",
              militar: obsRaw, 
              livro: pagLivro,
              status: termosAvaria.some(t => obsUpper.includes(t)) ? "CRÍTICO" : "CAUTELADO",
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
        avarias,
        emCautela: cautelas,
        reserva, // Agora enviará o número correto
      },
      grafico: [
        { name: 'Disponível', valor: reserva, fill: isPendente ? '#cbd5e1' : '#10b981' },
        { name: 'Cautela', valor: cautelas, fill: '#0284c7' },
        { name: 'Avaria', valor: avarias, fill: '#ef4444' }
      ],
      logs: historico
    });
  } catch (e) {
    console.error("Erro na API Stats:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}