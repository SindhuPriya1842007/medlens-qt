import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the MedLens Terms of Service covering use of the platform, AI-generated information, and medical limitations.',
}
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>

        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3">
              By accessing or using MedLens, you agree to these Terms of
              Service. If you do not agree with these terms, please do not use
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Description of the Service
            </h2>
            <p className="mt-3">
              MedLens provides tools for organizing, reviewing, and presenting
              medical information, including reports, laboratory results,
              medications, allergies, and related information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. User Responsibilities
            </h2>
            <p className="mt-3">
              You are responsible for providing accurate information, protecting
              your account credentials, and using the service in accordance
              with applicable laws and these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. AI-Generated Information
            </h2>
            <p className="mt-3">
              MedLens may use artificial intelligence to summarize, organize,
              or assist with medical information. AI-generated information may
              be incomplete or inaccurate and must not be treated as a
              definitive medical diagnosis or treatment recommendation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Medical Disclaimer
            </h2>
            <p className="mt-3">
              MedLens is not a replacement for a qualified healthcare
              professional. Medical decisions should be made with an
              appropriately qualified healthcare professional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Prohibited Use
            </h2>
            <p className="mt-3">
              You may not use MedLens for unlawful purposes, to interfere with
              the operation of the service, or to gain unauthorized access to
              systems or information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Service Availability
            </h2>
            <p className="mt-3">
              We may modify, suspend, or discontinue parts of the service as
              needed for maintenance, security, improvement, or other
              operational reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              8. Contact
            </h2>
            <p className="mt-3">
              For questions about these Terms of Service, please contact the
              MedLens service administrator.
            </p>
          </section>
        </div>
      </div>
      <footer className="border-t bg-background">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
    <p className="text-sm text-muted-foreground">
      © 2026 MedLens. All rights reserved.
    </p>

    <div className="flex items-center gap-6">
      <a
        href="/privacy"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Privacy Policy
      </a>

      <a
        href="/terms"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Terms of Service
      </a>
    </div>
  </div>
</footer>
    </main>
  )
}
