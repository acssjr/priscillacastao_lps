"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { campaignIds, defaults } from "@/lib/cms/catalog";
import type { Media } from "@/lib/cms/store";
import styles from "./admin-panel.module.css";
type Asset = { src: string; name: string; width: number; height: number };
const originals = Array.from(new Map(campaignIds.flatMap(id => {
  const c = defaults[id]; return [c.hero.image, c.method.image, c.proof.poster, c.about.image].map(image => [image.src, { ...image, name: image.alt }] as const);
})).values());
export function MediaLibrary({ media, busy, onUpload, onChoose }: { media: Media[]; busy: boolean; onUpload: (file: File) => Promise<void>; onChoose?: (asset: Asset) => void }) {
  const [search, setSearch] = useState("");
  const assets: Asset[] = [...media.map(item => ({ src: "/api/media/" + item.id, name: item.name, width: item.width, height: item.height })), ...originals];
  return <div><p>Envie fotos JPG, PNG ou WebP de até 3 MB. As imagens originais também ficam disponíveis para reutilização.</p>
    <div className={styles.mediaTools}><label className={styles.upload}>Enviar imagem<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={async e => { const file = e.target.files?.[0]; if (file) await onUpload(file); e.target.value = ""; }} /></label><label className={styles.search}>Buscar imagem<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome ou descrição" /></label></div>
    <div className={styles.mediaGrid}>{assets.filter(item => item.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))).map(asset => <figure key={asset.src}><img src={asset.src} alt={asset.name} loading="lazy" /><figcaption>{asset.name}</figcaption>{onChoose && <button type="button" disabled={busy} onClick={() => onChoose(asset)}>Usar esta imagem</button>}</figure>)}</div>
    {!media.length && <p className={styles.help}>Você ainda não enviou imagens. Escolha uma original ou envie uma foto.</p>}
  </div>;
}
