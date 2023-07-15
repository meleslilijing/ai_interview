import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import Auth from '@/app/utils/auth'

// 注册
export const POST = async (req: Request) => {
  const {username, password} = await req.json()

  const {err, data} = Auth.register(username, password)

  if (err) {
    return NextResponse.json({
      status: 500,
      message: err.message,
    })
  }
  
  const {token} = data

  cookies().set('token', token, { secure: true })

  // 注册成功
  return NextResponse.json({
    status: 200,
    message: 'ok'
  })
}