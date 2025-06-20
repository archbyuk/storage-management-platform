import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up', '/architecture']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Check for Appwrite session cookie
  const session = request.cookies.get('appwrite-session')

  // Special case: /architecture is always accessible regardless of auth status
  if (pathname.startsWith('/architecture')) {
    return NextResponse.next()
  }

  // 1. If authenticated user tries to access public paths (sign-in, sign-up)
  // Redirect them to home page
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. If unauthenticated user tries to access protected routes
  // Store the attempted URL as a query parameter for post-login redirect
  if (!isPublicPath && !session) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Configure middleware execution paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public directory files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}