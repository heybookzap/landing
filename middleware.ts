import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isVVIP = request.cookies.get('vvip_session')?.value

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isVVIP) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = request.cookies.get('admin_session')?.value
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
