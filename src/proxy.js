import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname } = req.nextUrl;

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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};