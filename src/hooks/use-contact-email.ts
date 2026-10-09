"use client";

import { useState } from "react";

import { apiFetch } from "@/lib/api-client";

type ContactEmailState =
  | { status: "idle" | "loading" | "error" }
  | { status: "revealed"; email: string };

interface ContactEmailResponse {
  email: string;
}

export function useContactEmail() {
  const [state, setState] = useState<ContactEmailState>({ status: "idle" });

  const reveal = async () => {
    if (state.status === "loading" || state.status === "revealed") return;

    setState({ status: "loading" });

    try {
      const { email } = await apiFetch<ContactEmailResponse>("/api/contact-email", {
        method: "POST",
        body: JSON.stringify({ action: "reveal" }),
        cache: "no-store",
        credentials: "same-origin",
      });
      setState({ status: "revealed", email });
    } catch {
      setState({ status: "error" });
    }
  };

  return { state, reveal };
}
