import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionToken } from './lib/auth';

const protectedPaths = [
    '/account',
    '/orders',
    '/wishlist',
    '/checkout',
]

const authPaths = [
    '/login',
    '/signup'
]

const isProtectedPath = (pathname: string)=> {
    return protectedPaths.some((path)=> {
       return pathname === path || pathname.startsWith(path + '/') ? true : false;
    });
}
 
export async function proxy(request: NextRequest) {
    try {
        const session = await getSessionToken(request);

    if(!session && isProtectedPath(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    else if(session && authPaths.includes(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()

    } catch (error) {
        return NextResponse.json({error: "Service Unavailable."}, {status: 503})
    }
}
 
export const config = {
  matcher: [
    '/account',
    '/orders',
    '/wishlist',
    '/checkout',
    '/account/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/login',
    '/signup'
  ],
}