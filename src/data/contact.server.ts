import "server-only";

import { getServerEnv } from "@/env";

/** Read only when the reveal handler runs, so builds need no private address. */
export function getContactEmail(): string | undefined {
  return getServerEnv().CONTACT_EMAIL;
}
