import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inicializa o Prisma
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Recebe os dados enviados pelo App
    const body = await request.json();
    const { email, password } = body;

    // Validação básica de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

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

    // 5. LOGIN SUCESSO: Retorna o objeto COMPLETO para o App
    // Agora incluindo os campos que estavam causando o bug de sincronização
    return NextResponse.json({
      id: user.id,
      name: user.name || "Militar",
      email: user.email,
      re: user.re ?? "Não cadastrado",
      posto: user.posto ?? "Sd. QP PM",
      unidade: user.unidade ?? "17º BPM",
      nivel: user.nivel ?? "Operador",
      
      // CAMPOS ADICIONADOS PARA RESOLVER O BUG:
      telefone: user.telefone ?? "",
      setor: user.setor ?? "",
      image: user.image ?? "" 
    });

  } catch (error) {
    console.error("Erro na API Mobile Login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de dados." }, 
      { status: 500 }
    );
  }
}