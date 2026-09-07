"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function MobileMenu({ campaign }: { campaign: LandingCampaign }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.mobileMenuTrigger} aria-label="Abrir menu">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span className={styles.menuTriggerLabel}>Menu</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileMenuBackdrop} />
        <Dialog.Viewport className={styles.mobileMenuViewport}>
          <Dialog.Popup className={styles.mobileMenuPopup}>
            <div className={styles.mobileMenuTopline}>
              <Dialog.Title className={styles.mobileMenuTitle}>Menu</Dialog.Title>
              <Dialog.Close className={styles.mobileMenuClose} aria-label="Fechar menu">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </Dialog.Close>
            </div>
            <nav className={styles.mobileNavigation} aria-label="Menu mobile">
              {campaign.navigation.map((item, index) => (
                <a href={item.target} key={item.target} onClick={() => setOpen(false)}>
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
