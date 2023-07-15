import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function GET(req: Request, ctx: any) {
  cookies().set({
    name: 'token',
    value: '',
    expires: new Date('2016-10-05'),
    path: '/',
  })

  return NextResponse.json({
    status: 200,
    message: 'ok'
  })
}