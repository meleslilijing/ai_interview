import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import auth from '@/app/utils/auth'
 

export function middleware(request: NextRequest) {
  const cookies = request.cookies
  const tokenObj = cookies.get('token')

  if (!tokenObj ) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  const {err} = auth.check((tokenObj as any).value)
  if (err) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/', 
    // '/:path*'
    // '/api/:path*'
  ]
}