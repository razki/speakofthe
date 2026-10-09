/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { getServerEnv, publicEnv } from "@/env";

/**
 * Vercel's production domain, read at build time — the fallback when a deploy
 * doesn't set `NEXT_PUBLIC_SITE_URL` (none did: the live canonical said
 * localhost). Server-only: every consumer of `siteConfig` renders on the server.
 */
const vercelProduction = getServerEnv().VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "SPEAKOFTHE.",
  /** The home page's <title>: the brand + what it is (≤ 60 chars). */
  title: "SPEAKOFTHE. - Software consultancy",
  /** The hero's own lead line — the page's promise, in its words. */
  description:
    "North Yorkshire software consultancy. From discovery and design to development and delivery, we create bespoke digital solutions for your business.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url:
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000"),
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.jpg",
  /** Alt text for the share image. */
  ogImageAlt: "SPEAKOFTHE. — Software consultancy, North Yorkshire",
  /**
   * Blank until the brand actually holds a handle — an invented one would tag
   * whoever owns it. The metadata generator drops the Twitter site/creator
   * fields while this is empty.
   */
  twitterHandle: "",
  author: "SPEAKOFTHE.",
  /** From the hero copy — what the page is about, in its own words. */
  keywords: [
    "software consultancy",
    "bespoke software development",
    "digital design",
    "software discovery",
    "North Yorkshire",
  ],
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#0d0506",
} as const;
