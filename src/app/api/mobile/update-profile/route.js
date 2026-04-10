import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { id, name, re, posto } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        re,
        posto
      }
    });

    return NextResponse.json({ message: "Sucesso" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar no banco" }, { status: 500 });
  }
}