import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { StyleguideContent } from "./_components/styleguide-content"

export const metadata: Metadata = {
  title: "Styleguide · MediCoreAI (interno)",
  robots: { index: false, follow: false },
}

export default function StyleguidePage() {
  // Internal design catalog — never exposed. 404 outside dev.
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <StyleguideContent />
}
