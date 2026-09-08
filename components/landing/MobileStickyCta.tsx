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

  const visible = !heroVisible && !finalVisible;

  return (
    <aside
      className={styles.mobileSticky}
      data-testid="mobile-sticky-cta"
      data-visible={visible}
      aria-hidden={!visible}
    >
      <span className={styles.mobileStickyCopy}>
        <strong>Aula particular para iniciantes</strong>
        <small>Não precisa levar par.</small>
      </span>
      <WhatsAppLink
        aria-label="AGENDAR AULA"
        className={styles.mobileStickyLink}
        glow
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.individual}
        placement="sticky"
        offer="individual"
        tabIndex={visible ? 0 : -1}
      >
        <span className={styles.mobileStickyLabelMobile} aria-hidden="true">AGENDAR MINHA AULA</span>
        <span className={styles.mobileStickyLabelDesktop} aria-hidden="true">AGENDAR AULA</span>
      </WhatsAppLink>
    </aside>
  );
}
