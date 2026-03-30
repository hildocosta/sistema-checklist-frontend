import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// GET: Lista todos os militares
export async function GET() {
  try {
    // Buscando da tabela "User" e ordenando pela coluna "name" (padrão Neon/NextAuth)
    const { rows } = await sql`SELECT * FROM "User" ORDER BY name ASC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar militares:", error);
    return NextResponse.json({ error: "Falha ao carregar lista" }, { status: 500 });
  }
}

// POST: Cadastra um novo militar
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, posto, re, email, nivel, status } = body;

    // Inserindo usando 'name' para manter a compatibilidade com a tabela User
    const result = await sql`
      INSERT INTO "User" (name, posto, re, email, nivel, status)
      VALUES (${nome}, ${posto}, ${re}, ${email}, ${nivel}, ${status})
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar militar:", error);
    if (error.code === '23505') {
      return NextResponse.json({ error: "RE ou E-mail já cadastrado." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}