import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = [
    "/dashboard",
    "/markets",
    "/portfolio",
    "/orders",
    "/research",
    "/funds",
    "/profile",
    "/alerts",
    "/settings",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/markets/:path*",
    "/portfolio/:path*",
    "/orders/:path*",
    "/research/:path*",
    "/funds/:path*",
    "/profile/:path*",
    "/alerts/:path*",
    "/settings/:path*",
  ],
};

