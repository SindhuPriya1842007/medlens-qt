'use client'

import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ToastTone = 'default' | 'success' | 'warning' | 'error'
interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

const EVENT = 'medlens:toast'
let counter = 0

export function toast(
  title: string,
  opts: { description?: string; tone?: ToastTone } = {},
) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<Omit<ToastItem, 'id'>>(EVENT, {
      detail: { title, description: opts.description, tone: opts.tone ?? 'default' },
    }),
  )
}

function toneStyles(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return { icon: Check, cls: 'text-success' }
    case 'warning':
      return { icon: TriangleAlert, cls: 'text-warning-foreground' }
    case 'error':
      return { icon: TriangleAlert, cls: 'text-danger' }
    default:
      return { icon: Info, cls: 'text-primary' }
  }
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Omit<ToastItem, 'id'>>).detail
      const id = ++counter
      setItems((prev) => [...prev, { id, ...detail }])
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id))
      }, 4500)
    }
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {items.map((t) => {
        const { icon: Icon, cls } = toneStyles(t.tone)
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-lg animate-in slide-in-from-right-4"
          >
            <Icon className={cn('mt-0.5 size-4 shrink-0', cls)} />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description ? (
                <p className="text-xs text-muted-foreground">{t.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
