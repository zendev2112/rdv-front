'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Create the Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // First clear any stale sessions
      await supabase.auth.signOut()
      
      // Then sign in fresh
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      // Ensure the session is properly set before redirecting
      // This is critical - we need to wait for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Now redirect with router.push
      router.push('/admin')
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Acceso administrativo
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-t-md border-0 py-2 px-3 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary-red"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-b-md border-0 py-2 px-3 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary-red"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary-red px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-line focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}