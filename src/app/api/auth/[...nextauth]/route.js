import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// SEGURANÇA: Instância única do Prisma para evitar vazamento de conexões
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export const authOptions = {
  // 1. ESTRATÉGIA DE SESSÃO BLINDADA
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas (Turno de serviço)
    updateAge: 1 * 60 * 60, // Atualiza o token a cada 1 hora para renovar a segurança
  },

  // 2. BLINDAGEM DE COOKIES (Impede roubo de sessão via scripts)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true, // Crucial: O JS do navegador não consegue ler este cookie (Protege contra XSS)
        sameSite: "lax", // Protege contra CSRF
        path: "/",
        secure: true, // Força o uso de HTTPS
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validação básica
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais insuficientes.");
        }

        try {
          // Busca usuário
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }, // Normaliza email
          });

          // SEGURANÇA: Resposta genérica para evitar enumeração de usuários
          if (!user) {
            throw new Error("E-mail ou senha inválidos.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("E-mail ou senha inválidos.");
          }

          // Retorno de dados seguros (Não enviamos a senha aqui)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            re: user.re,     
            posto: user.posto
          };
        } catch (error) {
          // Log interno para o desenvolvedor, mas erro genérico para o usuário
          console.error("Erro na autenticação:", error.message);
          throw new Error("Erro no servidor de autenticação.");
        }
      },
    }),
  ],

  // 3. CALLBACKS COM MAPEAMENTO SEGURO
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.re = user.re;  
        token.posto = user.posto;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.re = token.re;       
        session.user.posto = token.posto;
      }
      return session;
    },
  },

  // 4. PÁGINAS E EVENTOS
  pages: {
    signIn: "/login",
    error: "/login", 
  },

  // SEGURANÇA: NEXTAUTH_SECRET é obrigatório em produção
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };