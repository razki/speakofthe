import Link from "next/link";

import { CareersBackground } from "@/components/careers/careers-background";
import { careersContent } from "@/data/mocks/careers";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const careersMetadata = generateMetadata({
  title: careersContent.metadataTitle,
  description: careersContent.metadataDescription,
  url: "/careers",
});

/** Server-rendered careers status, with a restrained decorative client leaf. */
export const CareersView = () => (
  <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-hero-bg font-sans text-hero-ink">
    <CareersBackground content={careersContent.background} />
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-page-gutter focus:top-6 focus:z-50 focus:bg-hero-bg focus:p-3"
    >
      {careersContent.skipLabel}
    </a>
    <header className="relative z-10 mx-auto flex w-full max-w-site-width items-center justify-between gap-6 px-page-gutter py-6">
      <Link href="/" className="font-display text-logo font-black leading-none tracking-tight">
        {siteConfig.name}
      </Link>
      <nav aria-label="Primary" className="font-display text-nav font-black uppercase tracking-tight">
        <Link href="/" className="inline-block py-3 hover:text-hero-muted">
          {careersContent.homeLabel}
        </Link>
      </nav>
    </header>
    <main id="main" className="relative z-10 mx-auto flex w-full max-w-site-width flex-1 flex-col items-center justify-center px-page-gutter py-section-space text-center">
      <h1 className="font-display text-contact-title font-black uppercase leading-none tracking-tight">
        {careersContent.title}
      </h1>
      <p className="mt-10 max-w-prose font-display text-service-title font-black leading-tight tracking-tight">
        {careersContent.availability}
      </p>
      <p className="mt-6 max-w-prose text-body leading-relaxed text-hero-muted">
        {careersContent.description}
      </p>
    </main>
  </div>
);
