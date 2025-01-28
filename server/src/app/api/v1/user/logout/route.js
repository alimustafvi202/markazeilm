import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = cookies()
  
    // Delete NextAuth related cookies
    cookieStore.delete('next-auth.csrf-token')
    cookieStore.delete('next-auth.callback-url')
    cookieStore.delete('next-auth.session-token')
  
    // You might also want to delete these secure versions if they exist
    cookieStore.delete('__Secure-next-auth.csrf-token')
    cookieStore.delete('__Secure-next-auth.callback-url')
    cookieStore.delete('__Secure-next-auth.session-token')
    cookieStore.delete('__Host-next-auth.csrf-token')

  return NextResponse.json({ success: true })
}

