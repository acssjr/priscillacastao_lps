"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function MobileMenu({ campaign }: { campaign: LandingCampaign }) {
  const [open, setOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);

  useEffect(() => {
    if (open) document.body.dataset.mobileMenuOpen = "true";
    else delete document.body.dataset.mobileMenuOpen;

    return () => {
      delete document.body.dataset.mobileMenuOpen;
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={(isOpen) => {
      if (isOpen || !pendingSection.current) return;
      const hash = pendingSection.current;
      pendingSection.current = null;
      requestAnimationFrame(() => {
        const section = document.getElementById(hash.slice(1));
        if (!section) return;
        history.pushState(null, "", hash);
        section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      });
    }}>
      <Dialog.Trigger className={styles.mobileMenuTrigger} aria-label="Abrir menu">
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
        </span>
        <span className={styles.menuTriggerLabel}>Menu</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileMenuBackdrop} />
        <Dialog.Viewport className={styles.mobileMenuViewport}>
          <Dialog.Popup className={styles.mobileMenuPopup}>
            <div className={styles.mobileMenuTopline}>
              <span className={styles.mobileMenuBrand} aria-hidden="true" data-mobile-menu-brand />
              <Dialog.Title className={styles.mobileMenuTitle}>Menu</Dialog.Title>
              <Dialog.Close className={styles.mobileMenuClose} aria-label="Fechar menu">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </Dialog.Close>
            </div>
            <nav className={styles.mobileNavigation} aria-label="Menu mobile">
              {campaign.navigation.map((item, index) => (
                <a href={item.target} key={item.target} onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  pendingSection.current = item.target;
                  setOpen(false);
                }}>
                  <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
            <WhatsAppLink
              className={styles.mobileMenuCta}
              phone={campaign.whatsapp.phone}
              message={campaign.whatsapp.messages.individual}
              placement="mobile_menu"
              offer="individual"
            >
              AGENDAR MINHA AULA
            </WhatsAppLink>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
