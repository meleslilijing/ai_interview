import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import auth from '@/app/utils/auth'


// 登录
export async function POST(req: Request, ctx: any) {
  const {username, password} = await req.json()

  const {err, data} = auth.login(username, password)
  if (err) {
    return NextResponse.json({
      status: 500,
      message: err.message,
    })
  }

  // 登录成功， 更新token in cookie
  const {token} = data
  cookies().set('token', token, { secure: true })

  return NextResponse.json({
    status: 200,
    message: 'ok'
  })
}