import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // Validação básica de segurança
    if (!filename) {
      return NextResponse.json(
        { error: "Nome do arquivo não informado na URL" }, 
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { error: "Corpo da requisição vazio" }, 
        { status: 400 }
      );
    }

    // O SDK do Vercel Blob utiliza a variável BLOB_READ_WRITE_TOKEN automaticamente
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Erro no processamento do upload:", error);
    return NextResponse.json(
      { error: "Falha ao salvar arquivo no storage" }, 
      { status: 500 }
    );
  }
}