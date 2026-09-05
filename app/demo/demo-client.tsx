'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

export default function DemoClient() {
  const router = useRouter()
  const { loginDemo, user } = useAuth()

  useEffect(() => {
    loginDemo()
      .then(() => router.push('/dashboard'))
      .catch(() => router.push('/login'))
  }, [loginDemo, router])

  // If already signed in, redirect immediately
  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Starting MedLens demo…</p>
      <Button variant="outline" size="sm" render={<a href="/dashboard">Go to dashboard</a>}>
        Continue
      </Button>
    </div>
  )
}
