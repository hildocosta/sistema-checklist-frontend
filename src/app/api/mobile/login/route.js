import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inicializa o Prisma para conectar ao Neon
// Usar uma instância global ou garantir que não criamos múltiplas conexões em dev
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

    // 5. LOGIN SUCESSO: Retorna os dados para o App
    // Usamos o operador ?? para tratar valores null vindos do banco
    return NextResponse.json({
      id: user.id,
      name: user.name || "Militar",
      email: user.email,
      re: user.re ?? "Não cadastrado",      // Se for null, envia o texto
      posto: user.posto ?? "Soldado",       // Valor padrão caso esteja vazio
      unidade: user.unidade ?? "17º BPM",
      nivel: user.nivel ?? "Operador"
    });

  } catch (error) {
    console.error("Erro na API Mobile:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de dados." }, 
      { status: 500 }
    );
  }
}