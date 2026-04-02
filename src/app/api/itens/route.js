import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Lógica para salvar o material/carga
    console.log("Dados recebidos do Item:", data);

    return NextResponse.json({ message: "Item cadastrado!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}