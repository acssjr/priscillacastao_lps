"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { OfferKey } from "@/content/landing-pages/schema";
import { trackEvent, type TrackingEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Placement = Extract<TrackingEvent, { name: "whatsapp_click" }>["placement"];

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  phone: string;
  message: string;
  placement: Placement;
  offer: OfferKey;
  children: ReactNode;
};

export function WhatsAppLink({ phone, message, placement, offer, children, ...props }: Props) {
  const handleClick = () => {
    if (placement === "format") trackEvent({ name: "format_select", offer });
    trackEvent({ name: "whatsapp_click", placement, offer });
  };

  return (
    <a {...props} href={buildWhatsAppUrl(phone, message)} onClick={handleClick}>
      {children}
    </a>
  );
}
