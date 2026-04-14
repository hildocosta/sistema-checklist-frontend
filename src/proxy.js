import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Configuração da "Memória" do Upstash (Pega as chaves do seu .env automaticamente)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Limite: 10 acessos a cada 15 minutos por IP na tela de login
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
});

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // --- NÍVEL 3: BLOQUEIO DE ATAQUE DE FORÇA BRUTA ---
  // Só aplicamos o limite na rota de login e na tentativa de autenticação
  if (pathname === "/login" || pathname === "/api/auth/callback/credentials") {
    const ip = req.ip ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      // Se estourar o limite de 10 vezes, ele nem tenta carregar a página
      return new NextResponse("Muitas tentativas. Seu acesso foi bloqueado temporariamente por seguranca (15 min).", { status: 429 });
    }
  }

  // --- NÍVEL 1: PROTEÇÃO DE ROTAS (Seu código original melhorado) ---
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Liberar arquivos internos e API de autenticação
  if (
    pathname.includes("/api/auth") || 
    pathname.includes("/_next") || 
    pathname.includes("/assets") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const publicPaths = ["/login", "/register", "/esqueceu_senha", "/reset_senha"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Se logado e tentar ir pro login, manda pro dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Se não logado e tentar área restrita, manda pro login
  if (!isPublicPath && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};