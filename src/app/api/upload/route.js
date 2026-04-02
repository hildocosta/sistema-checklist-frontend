import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Erro Blob:", error);
    return NextResponse.json({ error: "Erro no storage da Vercel" }, { status: 500 });
  }
}