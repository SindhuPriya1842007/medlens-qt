// import Link from 'next/link'
// import { Logo } from '@/components/brand'
// import { Button } from '@/components/ui/button'

// export function SiteHeader() {
//   return (
//     <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
//       <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
//         <Link href="/" aria-label="MedLens home">
//           <Logo />
//         </Link>
//         <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
//           <a href="#why" className="transition-colors hover:text-foreground">
//             Why MedLens
//           </a>
//           <a href="#features" className="transition-colors hover:text-foreground">
//             Features
//           </a>
//           <a href="#responsible-ai" className="transition-colors hover:text-foreground">
//             Responsible AI
//           </a>
//           <a href="#security" className="transition-colors hover:text-foreground">
//             Security
//           </a>
//         </nav>
//         <div className="flex items-center gap-2">
//           {/* <Button variant="ghost" size="sm" render={<Link href="/login" />}>
//          */}
//          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
//             Sign In
//           </Button>
//           {/* <Button size="sm" render={<Link href="/register" />}> */}
//           <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
//             Get Started
//           </Button>
//         </div>
//       </div>
//     </header>
//   )
// }

'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/brand'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="MedLens home" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#why" className="transition-colors hover:text-foreground">
            Why MedLens
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#responsible-ai" className="transition-colors hover:text-foreground">
            Responsible AI
          </a>
          <a href="#security" className="transition-colors hover:text-foreground">
            Security
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign In
            </Button>

            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Get Started
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            <a
              href="#why"
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Why MedLens
            </a>

            <a
              href="#features"
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>

            <a
              href="#responsible-ai"
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Responsible AI
            </a>

            <a
              href="#security"
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Security
            </a>

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/login" />}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}