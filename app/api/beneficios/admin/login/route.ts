import { NextResponse } from 'next/server'

// Shared-password gate for the internal metrics dashboard. No accounts, no email
// — the team enters one password (BENEFICIOS_ADMIN_PASSWORD). On success we set an
// httpOnly cookie whose value is the password itself, so it can't be forged
// without knowing it; the dashboard compares the cookie to the env var server-side.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const form = await req.formData()
  const password = String(form.get('password') ?? '')
  const expected = process.env.BENEFICIOS_ADMIN_PASSWORD
  const origin = new URL(req.url).origin

  if (!expected || password !== expected) {
    return NextResponse.redirect(`${origin}/beneficios/admin?error=1`, { status: 303 })
  }

  const res = NextResponse.redirect(`${origin}/beneficios/admin`, { status: 303 })
  res.cookies.set('vb-admin', expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // allow over http on localhost
    sameSite: 'lax',
    path: '/beneficios/admin',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  return res
}
