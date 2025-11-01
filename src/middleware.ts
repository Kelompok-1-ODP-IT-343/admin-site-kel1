import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Kalau belum login, redirect ke /login
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

    // Jika ada refreshToken tapi token hilang
  if (!token && refreshToken && pathname.startsWith("/dashboard")) {
    const refreshUrl = new URL("/api/auth/refresh", req.url);
    refreshUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // Kalau sudah login tapi buka /login, redirect ke /dashboard
  if (token && req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Lanjut ke halaman berikutnya
  return NextResponse.next()
}

// Tentukan rute yang ingin dilindungi
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
