"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import styles from "./page.module.css";

/** Modal explanation: focus, dismissal and document scroll locking share one primitive. */
export function HybridExplanation({ fontClassName }: { fontClassName: string }) {
  const [keyboard, setKeyboard] = useState(false);
  return <Dialog.Root modal>
    <Dialog.Trigger className={styles.hybridLink} onClick={event => setKeyboard(event.detail === 0)}>
      dança híbrida<sup>*</sup>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.hybridBackdrop} />
      <Dialog.Popup id="hybrid-explanation" className={`${fontClassName} ${styles.hybridExplanation}`} data-keyboard={keyboard || undefined} onKeyDown={event => { if (event.key === "Escape") setKeyboard(true); }}>
        <Dialog.Title className={styles.hybridTitle}>Dança híbrida</Dialog.Title>
        <Dialog.Description>Ensino de forró roots junto com o universitário, combinando os dois estilos na sua prática.</Dialog.Description>
        <Dialog.Close onClick={event => setKeyboard(event.detail === 0)}>Entendi</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
