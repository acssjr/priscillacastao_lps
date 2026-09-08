"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { OfferKey } from "@/content/landing-pages/schema";
import { trackEvent, type TrackingEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./WhatsAppLink.module.css";

type Placement = Extract<TrackingEvent, { name: "whatsapp_click" }>["placement"];

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  phone: string;
  message: string;
  placement: Placement;
  offer: OfferKey;
  glow?: boolean;
  children: ReactNode;
};

export function WhatsAppLink({ phone, message, placement, offer, glow = false, className, children, ...props }: Props) {
  const handleClick = () => {
    if (placement === "format" || placement === "format_alternative") trackEvent({ name: "format_select", offer });
    trackEvent({ name: "whatsapp_click", placement, offer });
  };

  return (
    <a {...props} className={[className, glow ? styles.glowingLink : undefined].filter(Boolean).join(" ") || undefined} href={buildWhatsAppUrl(phone, message)} onClick={handleClick}>
      {glow && <span className={styles.glow} aria-hidden="true"><span className={styles.rim} /></span>}
      {children}
    </a>
  );
}
