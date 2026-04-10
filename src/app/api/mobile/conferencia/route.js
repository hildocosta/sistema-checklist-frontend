import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { responsavel, data, hora, itens, hash } = body;

   
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        hash,        
        responsavel, 
        data,
        hora,
        itens,       
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: novoRelatorio.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
    return NextResponse.json({ error: "Erro interno ao salvar" }, { status: 500 });
  }
}