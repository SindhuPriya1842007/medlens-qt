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

export default function RegisterClient() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast('Account created. Welcome to MedLens.', { tone: 'success' })
      router.push('/dashboard')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to create account.', { tone: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your MedLens account"
      subtitle="Start structuring your medical information today."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jordan Ellery"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
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
            autoComplete="new-password"
          />
          <PasswordStrength value={password} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
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
