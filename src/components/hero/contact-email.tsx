"use client";

import { useContactEmail } from "@/hooks/use-contact-email";

export interface ContactEmailLabels {
  reveal: string;
  loading: string;
  error: string;
  retry: string;
}

export interface ContactEmailProps {
  labels: ContactEmailLabels;
}

export function ContactEmail({ labels }: ContactEmailProps) {
  const { state, reveal } = useContactEmail();
  const isLoading = state.status === "loading";
  const buttonLabel = isLoading
    ? labels.loading
    : state.status === "error"
      ? labels.retry
      : labels.reveal;

  return (
    <div className="text-right font-sans text-label tracking-widest text-hero-muted uppercase">
      {state.status !== "revealed" && (
        <button
          type="button"
          disabled={isLoading}
          aria-busy={isLoading}
          onClick={reveal}
          className="min-h-11 cursor-pointer py-3 text-right uppercase hover:text-hero-ink disabled:cursor-wait"
        >
          {buttonLabel}
        </button>
      )}
      <p aria-live="polite" aria-atomic="true">
        {state.status === "revealed" && (
          <span className="inline-block break-all py-3 select-text">{state.email}</span>
        )}
        {state.status === "error" && labels.error}
        {isLoading && <span className="sr-only">{labels.loading}</span>}
      </p>
    </div>
  );
}
