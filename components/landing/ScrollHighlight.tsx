import styles from "./landing.module.css";

export function ScrollHighlight({ text, phrase }: { text: string; phrase: string }) {
  const index = text.indexOf(phrase);
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<span className={styles.scrollFill} data-scroll-fill>{phrase}<span className={styles.scrollFillOverlay} aria-hidden="true" data-fill-overlay>{phrase}</span></span>{text.slice(index + phrase.length)}</>;
}
