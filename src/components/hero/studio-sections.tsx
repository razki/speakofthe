import Link from "next/link";
import { ClientLogos } from "@/components/hero/client-logos";
import { ContactDirection } from "@/components/hero/contact-direction";
import { ContactEmail } from "@/components/hero/contact-email";
import type { ClientLogosContent } from "@/data/mocks/clients";
import type { StudioContent } from "@/data/mocks/studio";

export interface StudioSectionsProps {
  content: StudioContent;
  clients: ClientLogosContent;
}

export const StudioSections = ({ content, clients }: StudioSectionsProps) => (
  <>
    <section
      id="services"
      aria-labelledby="services-title"
      className="font-sans text-hero-ink"
    >
      <div className="mx-auto grid max-w-site-width gap-12 px-page-gutter py-section-space lg:grid-cols-12 lg:gap-16">
        <header className="lg:col-span-5 lg:self-center">
          <h2 id="services-title" className="font-display text-section-title leading-none font-black tracking-tight uppercase">
            {content.services.title}
          </h2>
        </header>
        <ol className="space-y-12 md:space-y-16 lg:col-span-7">
          {content.services.items.map((service) => (
            <li key={service.number} className="flex gap-6 md:gap-10">
              <span aria-hidden="true" className="pt-1 text-label text-hero-muted">
                {service.number}
              </span>
              <div className="min-w-0">
                <h3 className="mb-4 font-display text-service-title leading-tight font-black tracking-tight uppercase">
                  {service.title}
                </h3>
                <p className="max-w-prose text-body leading-relaxed text-hero-muted">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <ClientLogos content={clients} />

    <section
      id="about"
      aria-labelledby="about-title"
      className="font-sans text-hero-ink"
    >
      <div className="mx-auto grid max-w-site-width gap-12 px-page-gutter py-section-space lg:grid-cols-12 lg:gap-16">
        <header className="lg:col-span-5">
          <h2 id="about-title" className="font-display text-section-title leading-none font-black tracking-tight uppercase">
            {content.about.title}
          </h2>
        </header>
        <div className="lg:col-span-7">
          <p className="mb-12 max-w-prose font-display text-about-intro font-black leading-relaxed tracking-tight">
            {content.about.introduction}
          </p>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {content.about.blocks.map((block) => (
              <div key={block.title}>
                <h3 className="mb-4 font-display text-body font-black tracking-wide uppercase">
                  {block.title}
                </h3>
                <p className="text-body leading-relaxed text-hero-muted">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section id="contact" aria-labelledby="contact-title" className="font-sans text-hero-ink">
      <div className="mx-auto flex max-w-site-width flex-col gap-6 px-page-gutter py-12 md:flex-row md:items-center md:gap-12 md:py-16">
        <h2 id="contact-title" className="shrink-0 font-display text-service-title font-black leading-tight tracking-tight uppercase">
          {content.contact.title}
        </h2>
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-12">
          <ContactDirection motion={content.contact.direction} />
          <address className="max-w-3/4 shrink-0 text-right not-italic">
            <ContactEmail labels={content.contact.email} />
          </address>
        </div>
      </div>
    </section>

    <footer className="font-sans text-hero-muted">
      <div className="mx-auto max-w-site-width px-page-gutter">
        <div className="flex flex-col gap-8 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 font-display text-body font-black tracking-tight text-hero-ink">{content.footer.brand}</p>
            <p className="text-label leading-relaxed">{content.footer.companyDetails}</p>
          </div>
          <nav aria-label={content.footer.navigationLabel}>
            <ul className="flex gap-8 text-label">
              {content.footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} rel="noopener" className="hover:text-hero-ink">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  </>
);
