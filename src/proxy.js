import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
});

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // --- AJUSTE 1: LIBERAÇÃO IMEDIATA (Antes de qualquer verificação) ---
  // Isso garante que o Logout (/api/auth/signout) passe sem o porteiro segurar
  if (
    pathname.startsWith("/api/auth") || 
    pathname.startsWith("/_next") || 
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // --- NÍVEL 3: RATE LIMIT ---
  if (pathname === "/login") {
    const ip = req.ip ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse("Muitas tentativas. Seu acesso foi bloqueado temporariamente por seguranca (15 min).", { status: 429 });
    }
  }

  // --- NÍVEL 1: BUSCA DO TOKEN (Somente após liberar rotas essenciais) ---
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const publicPaths = ["/login", "/register", "/esqueceu_senha", "/reset_senha"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Lógica de redirecionamento
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicPath && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Ajustamos o matcher para ser mais preciso
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};