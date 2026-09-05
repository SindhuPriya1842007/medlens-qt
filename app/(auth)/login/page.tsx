'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField, PasswordStrength } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'
import { toast } from '@/components/ui/toaster'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast('Welcome back to MedLens.', { tone: 'success' })
      router.push('/dashboard')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to sign in.', { tone: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setLoading(true)
    try {
      await loginDemo()
      toast('Exploring MedLens in demo mode.', { tone: 'success' })
      router.push('/dashboard')
    } catch {
      toast('Unable to start demo.', { tone: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in to MedLens"
      subtitle="Access your structured medical information."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <PasswordStrength value={password} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Sign In
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="mt-4 w-full" onClick={handleDemo} disabled={loading}>
        Explore Demo
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Get started
        </Link>
      </p>

      <Link
        href="/"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Back to home
      </Link>
    </AuthShell>
  )
}
