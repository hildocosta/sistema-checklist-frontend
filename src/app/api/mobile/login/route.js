import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inicializa o Prisma para conectar ao Neon
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Recebe os dados enviados pelo App
    const body = await request.json();
    const { email, password } = body;

    // 2. Procura o militar no banco pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Se não achar o e-mail, retorna erro
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado em nossa base." }, 
        { status: 401 }
      );
    }

    // 4. Compara a senha digitada com a senha criptografada do banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Senha incorreta. Tente novamente." }, 
        { status: 401 }
      );
    }

    // 5. LOGIN SUCESSO: Retorna os dados que o App precisa exibir
    // É daqui que o seu Perfil vai tirar o RE e o Posto!
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      re: user.re,
      posto: user.posto
    });

  } catch (error) {
    console.error("Erro na API Mobile:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de dados." }, 
      { status: 500 }
    );
  }
}