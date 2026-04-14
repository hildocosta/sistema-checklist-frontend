import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Obtém o token usando a secret do ambiente para garantir autenticidade
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = req.nextUrl;

  // 1. PERMITIR SEMPRE: NextAuth, arquivos internos do Next e assets públicos
  // Isso evita que o middleware bloqueie o próprio processo de login ou o carregamento do CSS/Imagens
  if (
    pathname.includes("/api/auth") || 
    pathname.includes("/_next") || 
    pathname.includes("/assets") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. DEFINIÇÃO DE ROTAS PÚBLICAS
  const publicPaths = ["/login", "/register", "/esqueceu_senha", "/reset_senha"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 3. LOGICA DE REDIRECIONAMENTO (O CORAÇÃO DA SEGURANÇA)
  
  // Caso A: Usuário logado tentando acessar páginas de Login/Registro
  // Redirecionamos para o Dashboard para evitar "duplo login"
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Caso B: Usuário DESLOGADO tentando acessar rotas restritas (Dashboard, Perfil, etc)
  // Mandamos de volta para o Login com a URL de destino salva no 'callbackUrl'
  if (!isPublicPath && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(url);
  }

  // Caso C: Se passar pelas verificações, permite o acesso
  return NextResponse.next();
}

// O Matcher garante que o código rode apenas em rotas relevantes, economizando performance
export const config = {
  matcher: [
    /*
     * Aplica a todas as rotas de páginas, mas ignora:
     * - api (rotas de servidor)
     * - _next/static (arquivos estáticos otimizados)
     * - _next/image (processamento de imagens do Next)
     * - favicon.ico (ícone)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};