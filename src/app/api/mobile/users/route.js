import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        re: true,
        posto: true,
        email: true,
        nivel: true,
        image: true,
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    
    console.error("Erro na API de usuários:", error);

    return NextResponse.json(
      { error: "Erro ao buscar usuários" }, 
      { status: 500 }
    );
  }
}