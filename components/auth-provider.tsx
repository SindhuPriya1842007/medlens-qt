'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '@/lib/api'
import type { User } from '@/lib/types'

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginDemo: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)
const COOKIE = 'medlens_token'

function setCookie(value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${COOKIE}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}
function clearCookie() {
  document.cookie = `${COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
function hasCookie() {
  if (typeof document === 'undefined') return false
  return /(?:^|;\s*)medlens_token=/.test(document.cookie)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!hasCookie()) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.me()
        if (active) setUser(me)
      } catch {
        clearCookie()
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password)
    setCookie(`demo-token-${u.id}`)
    setUser(u)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const u = await authApi.register(name, email, password)
    setCookie(`demo-token-${u.id}`)
    setUser(u)
  }, [])

  const loginDemo = useCallback(async () => {
    const u = await authApi.me()
    setCookie(`demo-token-${u.id}`)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    clearCookie()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
