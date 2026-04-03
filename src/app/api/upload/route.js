import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // 1. Validação simples e direta para não consumir o stream do body prematuramente
    if (!filename) {
      return NextResponse.json({ error: "Nome do arquivo ausente" }, { status: 400 });
    }

    // 2. Captura do Content-Type original para manter a fidelidade do arquivo
    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    // 3. Execução do Upload
    // Mantivemos o request.body direto como no seu código que funcionava
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true, // Garante que nunca haverá erro de duplicata/substituição
      contentType: contentType,
    });

    // 4. Retorno COMPLETO (Exatamente como o seu antigo fazia, mas com os novos campos)
    // O seu frontend antigo esperava o objeto blob inteiro
    return NextResponse.json(blob);

  } catch (error) {
    console.error("❌ Erro no Storage da Vercel:", error);
    return NextResponse.json(
      { error: "Erro ao processar storage: " + error.message }, 
      { status: 500 }
    );
  }
}