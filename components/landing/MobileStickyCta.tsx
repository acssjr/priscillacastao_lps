"use client";

import { useEffect, useState } from "react";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function MobileStickyCta({ campaign }: { campaign: LandingCampaign }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#hero-primary-cta");
    const finalCta = document.querySelector("#final-primary-cta");
    if (!hero || !finalCta || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === finalCta) setFinalVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  return (
    <aside className={styles.mobileSticky} data-testid="mobile-sticky-cta" hidden={heroVisible || finalVisible}>
      <WhatsAppLink
        className={styles.mobileStickyLink}
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.individual}
        placement="sticky"
        offer="individual"
      >
        Conversar sobre uma aula
      </WhatsAppLink>
    </aside>
  );
}
