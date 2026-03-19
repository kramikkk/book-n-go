import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/login', '/register']

// Routes that start with these prefixes are also public (business landing pages)
const PUBLIC_PREFIXES = ['/api/auth/']

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true

  // /{slug} landing page — matches /something but not /admin or /api
  // The landing page is public so users can see it before logging in
  const slugLanding = /^\/[^/]+$/.test(pathname)
  const isReservedRoot =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/customer')
  if (slugLanding && !isReservedRoot) return true

  return false
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Skip auth checks for public routes — prevents redirect loops on
  // /login, /register, and /{slug} landing pages
  if (isPublicRoute(pathname)) {
    return response
  }

  // Use getUser() instead of getSession() — getSession() only reads from the
  // cookie and can be spoofed. getUser() verifies the token with Supabase's
  // server, which is the only secure way to check identity in middleware.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Not logged in — redirect to login
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  
  const role = user.app_metadata?.role

  // Admin routes — only admins allowed
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url))
  }

  // Customer routes — only customers allowed
  if (pathname.startsWith('/customer') && role !== 'customer') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}
