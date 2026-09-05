import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <path
            d="M12 3.5c-1.6 2.4-3.8 3.6-6.5 3.9v5.1c0 3.4 2.4 6 6.5 7.9 4.1-1.9 6.5-4.5 6.5-7.9V7.4C15.8 7.1 13.6 5.9 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            className="opacity-90"
          />
          <path
            d="M8.5 12.2h2l1-2.2 1.4 4 1-1.8h1.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Med<span className="text-primary">Lens</span>
        </span>
      ) : null}
    </span>
  )
}
