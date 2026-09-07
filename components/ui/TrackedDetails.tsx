"use client";

import type { DetailsHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "onToggle"> & {
  question: string;
  children: ReactNode;
};

export function TrackedDetails({ question, children, ...props }: Props) {
  return (
    <details
      {...props}
      onToggle={(event) => {
        if (event.currentTarget.open) trackEvent({ name: "faq_open", question });
      }}
    >
      {children}
    </details>
  );
}
