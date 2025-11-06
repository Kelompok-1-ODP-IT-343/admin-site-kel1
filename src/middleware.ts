import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Proteksi dashboard: jika token kosong tetapi refreshToken ada, biarkan lanjut
  // agar client-side interceptor bisa melakukan refresh otomatis.
  if (!token && pathname.startsWith('/dashboard')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // ada refreshToken → lanjutkan
    return NextResponse.next()
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
