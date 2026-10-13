"use client";
import { fieldLabel, protectedKeys } from "@/lib/cms/catalog";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { defaults } from "@/lib/cms/catalog";
import { editorGroups, getAt } from "@/lib/cms/editor-structure";
import { PhotoFraming } from "./photo-framing";
import styles from "./admin-panel.module.css";
export type FieldPath = (string | number)[];
export function setAt<T>(object: T, path: FieldPath, value: unknown): T {
  const next = structuredClone(object);
  let node: Record<string | number, unknown> = next as Record<string | number, unknown>;
  for (const key of path.slice(0, -1)) node = node[key] as Record<string | number, unknown>;
  node[path.at(-1)!] = value;
  return next;
}
type Props = { campaign: LandingCampaign; section: string; disabled: boolean;
  onChange: (path: FieldPath, value: unknown) => void; onChoose: (path: FieldPath) => void; search: string; selectedPath?: FieldPath; omitPath?: FieldPath; ratio?: number };
export function SectionEditor({ campaign, section, disabled, onChange, onChoose, search, selectedPath, omitPath, ratio }: Props) {
  function render(value: unknown, path: FieldPath, title: string) {
    const key = String(path.at(-1)), id = "field-" + path.join("-");
    if (omitPath && path.join(".") === omitPath.join(".")) return null;
    if (protectedKeys.has(key)) return null;
    if (typeof value === "string") {
      const original = getAt(defaults[campaign.id as keyof typeof defaults],path);
      if (search && !(title + " " + value).toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))) return null;
      const multiline = value.length > 65 || ["title", "body", "answer", "description", "general", "individual", "dupla", "grupo-workshop"].includes(key);
      return <div className={styles.field} key={id}><div className={styles.fieldHeading}><label htmlFor={id}>{title}</label><button type="button" disabled={disabled || typeof original !== "string" || value === original} onClick={() => {if (typeof original === "string") onChange(path,original);}}>Restaurar</button></div>
        {multiline ? <textarea id={id} value={value} rows={key === "answer" ? 4 : 3} maxLength={6000} disabled={disabled} onChange={e => onChange(path, e.target.value)} />
          : <input id={id} type={key === "instagram" ? "url" : "text"} inputMode={key === "phone" ? "tel" : undefined} value={value} maxLength={6000} disabled={disabled} onChange={e => onChange(path, e.target.value)} />}
        {["titleEmphasis", "highlight"].includes(key) && <small>Copie exatamente o trecho do título que deve receber destaque.</small>}
        {key === "phone" && <small>Inclua 55, DDD e número, somente dígitos. Exemplo de formato: 5571999999999.</small>}
        {key === "alt" && <small>Descreva a foto para quem usa leitor de tela.</small>}
      </div>;
    }
    if (typeof value === "boolean") return <label className={styles.check} key={id}><input type="checkbox" checked={value} disabled={disabled} onChange={e => onChange(path, e.target.checked)} />{title}</label>;
    if (Array.isArray(value)) {
      const flexible = key === "items" || key === "body";
      const maximum = key === "items" ? 30 : 10;
      return <fieldset key={id} className={styles.collection}><legend>{title}</legend>{value.map((item, index) => <div className={styles.collectionItem} key={index}>
        <div className={styles.itemHeading}><strong>{typeof item === "object" && item && "question" in item ? "Pergunta " + (index + 1) : title + " " + (index + 1)}</strong>
          {flexible && <div className={styles.inlineActions}><button type="button" aria-label={"Subir item " + (index + 1)} disabled={disabled || index === 0} onClick={() => { const list = [...value]; [list[index-1], list[index]] = [list[index], list[index-1]]; onChange(path, list); }}>Subir</button><button type="button" aria-label={"Descer item " + (index + 1)} disabled={disabled || index === value.length-1} onClick={() => { const list = [...value]; [list[index+1], list[index]] = [list[index], list[index+1]]; onChange(path, list); }}>Descer</button><button type="button" disabled={disabled || value.length <= 1} onClick={() => onChange(path, value.filter((_, i) => i !== index))}>Remover</button></div>}
        </div>{render(item, [...path, index], typeof item === "string" ? "Texto " + (index+1) : title)}
      </div>)}{flexible && <button type="button" disabled={disabled || value.length >= maximum} onClick={() => onChange(path, [...value, key === "items" ? { question: "", answer: "" } : ""])}>Adicionar {key === "items" ? "pergunta" : "parágrafo"}</button>}</fieldset>;
    }
    if (value && typeof value === "object") {
      const object = value as Record<string, unknown>;
      if (typeof object.src === "string") {
        const position = typeof object.position === "string" ? object.position : "50% 50%";
        const [x,y] = position.split(" ").map(v => Number.parseInt(v, 10));
        return <fieldset key={id} className={styles.imageField}><legend>{title}</legend>
          <PhotoFraming src={object.src} value={position} onChange={value => onChange([...path,"position"],value)} disabled={disabled} label="Enquadramento da imagem" ratio={ratio} />
          <button type="button" disabled={disabled} onClick={() => onChoose(path)}>Trocar imagem</button>
          {render(object.alt, [...path, "alt"], "Descrição da imagem")}
          <label>Posição horizontal<input type="range" min={0} max={100} value={x} disabled={disabled} onChange={e => onChange([...path,"position"], e.target.value + "% " + y + "%")} /></label>
          <label>Posição vertical<input type="range" min={0} max={100} value={y} disabled={disabled} onChange={e => onChange([...path,"position"], x + "% " + e.target.value + "%")} /></label>
          <small>Confira o enquadramento também na prévia para celular.</small>
        </fieldset>;
      }
      return <div key={id} className={styles.fieldGroup}>{path.length > 1 && !Number.isInteger(path.at(-1)) && <h3>{title}</h3>}{Object.entries(object).map(([k,v]) => render(v, [...path,k], fieldLabel(k)))}</div>;
    }
    return null;
  }
  if (selectedPath) return <div className={styles.selectedFields}>{render(getAt(campaign,selectedPath),selectedPath,fieldLabel(String(selectedPath.at(-1))))}</div>;
  return <div className={styles.fields}>{editorGroups(section).map((group,index) => <details key={section + group.title} open={index === 0} className={styles.controlGroup}><summary>{group.title}</summary><div className={styles.fieldGroup}>{group.paths.map(path => render(getAt(campaign,path),path,fieldLabel(String(path.at(-1)))))}</div></details>)}</div>;
}
