import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
   
    const token = await getToken({req:request})

    const url = request.nextUrl;
    if (!token && url.pathname !== '/login' && url.pathname !== '/signup') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && url.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login',
            '/signup',
            '/',
            '/dashboard/:path*',
                ],
}