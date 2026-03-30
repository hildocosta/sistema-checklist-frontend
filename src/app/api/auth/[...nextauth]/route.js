import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  // Configuração dos provedores de acesso
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Verificação básica de preenchimento
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios.");
        }

        // 2. Busca o usuário no Banco de Dados Neon via Prisma
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 3. Se o usuário não existir no banco
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        // 4. Comparação da senha digitada com o Hash do banco (Bcrypt)
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Senha incorreta.");
        }

        // 5. Retorna o objeto do usuário para criar a sessão (Cookie)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Configurações de Sessão e Segurança
  session: {
    strategy: "jwt", // Usa JSON Web Token para manter o login
    maxAge: 8 * 60 * 60, // O login expira em 8 horas (um turno de serviço)
  },

  pages: {
    signIn: "/login", // Redireciona para sua página customizada se não estiver logado
  },

  secret: process.env.NEXTAUTH_SECRET, // Chave que está no seu arquivo .env

  callbacks: {
    // Adiciona o ID do usuário no token para usar no Dashboard se precisar
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Torna o ID disponível na sessão do lado do cliente
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// O Next.js App Router exige que exportemos o handler como GET e POST
export { handler as GET, handler as POST };