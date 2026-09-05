import type * as React from 'react'
import { cn } from '@/lib/utils'
import { toneClasses, type Tone } from '@/lib/clinical'

interface BadgeProps extends React.ComponentProps<'span'> {
  tone?: Tone
}

function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        toneClasses(tone),
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
