"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

export function TrackedExternalLink({ children, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent({ name: "proof_open", source: "instagram" });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
