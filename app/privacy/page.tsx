import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the MedLens Privacy Policy to understand how information is handled and protected.',
}
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Introduction
            </h2>
            <p className="mt-3">
              MedLens is designed to help users organize, review, and understand
              medical information. We take the privacy and security of health
              information seriously.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              Depending on how you use MedLens, information may include account
              information, patient information, medical reports, laboratory
              results, medications, allergies, and other information that you
              choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. How We Use Information
            </h2>
            <p className="mt-3">
              Information may be used to provide application features,
              organize medical records, generate summaries, display trends,
              support verification workflows, and improve the functionality
              and security of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Data Security
            </h2>
            <p className="mt-3">
              We use reasonable technical and organizational measures designed
              to protect information from unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. AI-Generated Information
            </h2>
            <p className="mt-3">
              Some MedLens features may use artificial intelligence to organize,
              summarize, or assist with interpretation of information. AI output
              may contain errors and should be reviewed by a qualified
              healthcare professional when appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Your Choices
            </h2>
            <p className="mt-3">
              Users may request information about their data and may request
              correction or deletion where applicable and technically
              available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Medical Disclaimer
            </h2>
            <p className="mt-3">
              MedLens is an information-management and decision-support tool.
              It is not a substitute for professional medical advice,
              diagnosis, or treatment. Always consult an appropriately
              qualified healthcare professional regarding medical decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              8. Contact
            </h2>
            <p className="mt-3">
              For privacy-related questions, please contact the MedLens
              service administrator.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}