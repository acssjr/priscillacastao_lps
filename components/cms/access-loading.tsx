"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./access-loading.module.css";
export function AccessLoading({ stage = "loading" }: { stage?: "authenticating" | "opening" | "loading" }) {
 const [slow,setSlow] = useState(false); const router = useRouter(); const status = useRef<HTMLDivElement>(null);
 useEffect(() => { status.current?.focus({preventScroll:true}); const timer = setTimeout(() => setSlow(true),12000); return () => clearTimeout(timer); },[stage]);
 return <div className={styles.screen}><div className={styles.content}><div className={styles.mark} aria-hidden="true"><img src="/favicon.svg" width="44" height="44" alt="" /></div><div ref={status} className={styles.status} role="status" tabIndex={-1} aria-live="polite"><h1>{stage === "authenticating" ? "Verificando seu acesso" : "Abrindo o painel"}</h1><p>{stage === "authenticating" ? "Conferindo usuário e senha." : "Carregando o conteúdo e as ferramentas de gestão."}</p></div><div className={styles.track} aria-hidden="true"><span /></div>{stage !== "loading" && <ol className={styles.steps} aria-label="Etapas de acesso"><li data-current={stage === "authenticating"} data-complete={stage === "opening"}><span>1</span>{stage === "opening" ? "Acesso confirmado" : "Verificar acesso"}</li><li data-current={stage === "opening"}><span>2</span>Abrir painel</li></ol>}{slow && <div className={styles.slow} role="status"><p>Está levando mais tempo que o habitual. A solicitação continua em andamento.</p>{stage !== "authenticating" && <button onClick={() => {router.replace("/admin");router.refresh();}}>Tentar abrir novamente</button>}</div>}</div></div>;
}
