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

    // TERMOS DE ESTOQUE ATUALIZADOS
    const termosEstoque = [
      'DISPONÍVEL', 'DISPONIVEL', 'FURRIELAÇÃO', 'FURRIELACAO', 
      'RESERVA', 'ESTOQUE', 'OK', '---', 'CONFERIDO'
    ];
    
    const termosAvaria = [
      'AVARIA', 'DEFEITO', 'EXTRAVIO', 'QUEBRADO', 'DANIFICADO', 'FURTADA', 
      'FURTADO', 'MANUTENÇÃO', 'MANUTENCAO', 'PROBLEMA', 'ANTENA', 'BASE'
    ];

    let avarias = 0, cautelas = 0, reserva = 0;
    let historico = [];
    const processados = new Set();

    relatoriosDoDia.forEach(rel => {
      (rel.itens || []).forEach(item => {
        const obsRaw = (item.cautela || "").trim();
        const obsUpper = obsRaw.toUpperCase();

        // Se estiver como DISPONÍVEL ou similar, conta como Reserva
        if (!obsRaw || termosEstoque.some(t => obsUpper.includes(t))) {
          if (rel.id === ultimoRelatorio.id) reserva++;
          return;
        }

        const logKey = `${item.serie}-${obsUpper}`;
        if (processados.has(logKey)) return;
        processados.add(logKey);

        const temAvaria = termosAvaria.some(t => obsUpper.includes(t));
        if (temAvaria) avarias++; else cautelas++;

        historico.push({
          id: item.serie || item.pmpr || "S/N",
          militar: obsRaw,
          status: temAvaria ? "CRÍTICO" : "CAUTELADO",
          hora: rel.hora,
          responsavel: rel.responsavel
        });
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
        reserva,
      },
      grafico: [
        { name: 'Disponível', valor: reserva, fill: isPendente ? '#cbd5e1' : '#10b981' },
        { name: 'Cautela', valor: cautelas, fill: '#0284c7' },
        { name: 'Avaria', valor: avarias, fill: '#ef4444' }
      ],
      logs: historico
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}