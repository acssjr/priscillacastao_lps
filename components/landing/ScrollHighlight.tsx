import styles from "./landing.module.css";

export function ScrollHighlight({ text, phrase }: { text: string; phrase: string }) {
  const index = text.toLocaleLowerCase("pt-BR").indexOf(phrase.toLocaleLowerCase("pt-BR"));
  if (index < 0) return <>{text}</>;
  const matching = text.slice(index,index + phrase.length);
  return <>{text.slice(0, index)}<span className={styles.scrollFill} data-scroll-fill>{matching}<span className={styles.scrollFillOverlay} aria-hidden="true" data-fill-overlay>{matching}</span></span>{text.slice(index + phrase.length)}</>;
}
