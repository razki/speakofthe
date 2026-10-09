import { z } from "zod";

import { getContactEmail } from "@/data/contact.server";
import { publicEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";

const revealSchema = z.strictObject({ action: z.literal("reveal") });
const querySchema = z.strictObject({});

const revealContactEmail = handle(async (request) => {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  // The application may receive an internal HTTP origin behind AWS proxies.
  // Compare with the configured public origin, never client-supplied forwarding headers.
  const expectedOrigin = publicEnv.NEXT_PUBLIC_SITE_URL
    ? new URL(publicEnv.NEXT_PUBLIC_SITE_URL).origin
    : request.nextUrl.origin;

  if (
    origin !== expectedOrigin ||
    (fetchSite !== null && fetchSite !== "same-origin")
  ) {
    throw new ApiError(403, "forbidden", "Use the contact control on this website.");
  }

  querySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  revealSchema.parse(await request.json());

  const email = getContactEmail();
  if (!email) {
    throw new ApiError(503, "contact_unavailable", "Contact details are temporarily unavailable.");
  }

  return { email };
});

export const POST: typeof revealContactEmail = async (request, context) => {
  const response = await revealContactEmail(request, context);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
};
