"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CampaignId } from "@/content/landing-pages/registry";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { campaignIds, campaignNames, sections } from "@/lib/cms/catalog";
import { editableField, pathFromId, sectionForField, type FieldPath } from "@/lib/cms/editor-structure";
import { SectionEditor } from "./section-editor";
import { AdminIcon } from "./admin-sidebar";
import styles from "./visual-editor.module.css";
export function VisualEditor({ campaignId, campaign, section, onCampaign, onSection, onChange, onChoose, onSave, onUndo, onRedo, canUndo, canRedo, busy, dirty }: {
  campaignId: CampaignId; campaign: LandingCampaign; section: string; onCampaign: (id: CampaignId) => void; onSection: (id: string) => void;
  onChange: (path: FieldPath,value: unknown) => void; onChoose: (path: FieldPath) => void; onSave: () => void; onUndo: () => void; onRedo: () => void;
  canUndo: boolean; canRedo: boolean; busy: boolean; dirty: boolean;
}) {
  const [selected,setSelected] = useState<string|null>(null);
  const [device,setDevice] = useState("desktop"), [zoom,setZoom] = useState("fit"), [enabled,setEnabled] = useState(true), [inspector,setInspector] = useState(true);
  const [ready,setReady] = useState(false), [failed,setFailed] = useState(false), [reload,setReload] = useState(0);
  const [canvasSize,setCanvasSize] = useState({width:960,height:650});
  const [ratios,setRatios] = useState<Record<string,number>>({});
  const canvas = useRef<HTMLDivElement>(null), frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef({campaign,onChange,onChoose,onSection,section,enabled,selected,busy});
  useLayoutEffect(() => { latest.current = {campaign,onChange,onChoose,onSection,section,enabled,selected,busy}; });
  const send = useCallback((message: Record<string,unknown>) => frame.current?.contentWindow?.postMessage({channel:"priscilla-editor",...message},window.location.origin),[]);
  const sync = useCallback(() => send({type:"sync",campaign:latest.current.campaign,enabled:latest.current.enabled && !latest.current.busy,selected:latest.current.selected}),[send]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.channel !== "priscilla-editor") return;
      const message = event.data;
      if (message.type === "ready") { setReady(true); setFailed(false); sync(); send({type:"focus",section:latest.current.section}); return; }
      const field = editableField(latest.current.campaign,message.id);
      if (!field) return;
      if (message.type === "change" && !latest.current.busy && latest.current.enabled && field.kind === "text" && typeof message.value === "string" && message.value.length <= 6000) latest.current.onChange(field.path,message.value);
      if (message.type === "select") { setSelected(message.id); setInspector(true); latest.current.onSection(sectionForField(message.id)); }
      if (message.type === "choose-image" && !latest.current.busy && field.kind === "image") { setSelected(message.id); setInspector(true); latest.current.onChoose(field.path); }
      if (message.type === "photo-frame" && field.kind === "image" && typeof message.ratio === "number" && message.ratio > 0 && message.ratio < 10) setRatios(current => ({...current,[message.id]:message.ratio}));
    }
    window.addEventListener("message",receive); return () => window.removeEventListener("message",receive);
  },[send,sync]);
  useEffect(() => { sync(); },[campaign,enabled,selected,busy,sync]);
  useEffect(() => {
    const node = canvas.current; if (!node) return;
    const measure = () => { const rect = node.getBoundingClientRect(); if (rect.width && rect.height) setCanvasSize({width:rect.width,height:rect.height}); };
    const initialFrame = requestAnimationFrame(() => { measure(); if (window.matchMedia("(max-width:767px)").matches) setDevice("mobile"); }); const observer = new ResizeObserver(measure); observer.observe(node);
    return () => { cancelAnimationFrame(initialFrame); observer.disconnect(); };
  },[]);
  useEffect(() => { const timer = window.setTimeout(() => setFailed(true),12000); return () => clearTimeout(timer); },[campaignId,reload]);
  const frameWidth = device === "mobile" ? 390 : 1280;
  const scale = zoom === "fit" ? Math.min(1,canvasSize.width/frameWidth) : 1;
  useEffect(() => { if (ready) send({type:"scale",value:scale}); },[ready,scale,send]);
  const current = sections.find(item => item.id === section)!;
  const selectedField = editableField(campaign,selected);
  function chooseSection(id: string) { onSection(id); setSelected(null); setInspector(true); send({type:"focus",section:id}); }
  return <div className={styles.editor} data-editor-ready={ready}>
    <div className={styles.heading}><div><h1>Edição visual</h1><span>Clique em um texto para escrever no próprio site. Fotos e perguntas também têm controles por seção.</span></div><button disabled={busy || !dirty} onClick={onSave}>{busy ? "Salvando…" : "Salvar rascunho"}</button></div>
    <div className={styles.toolbar}>
      <label>Página em edição<select disabled={busy} value={campaignId} onChange={event => { setSelected(null); setReady(false); setFailed(false); onCampaign(event.target.value as CampaignId); }}>{campaignIds.map(id => <option key={id} value={id}>{campaignNames[id]}</option>)}</select></label>
      <label>Visualização<select value={device} onChange={event => setDevice(event.target.value)}><option value="desktop">Computador</option><option value="mobile">Celular</option></select></label>
      <label>Zoom<select value={zoom} onChange={event => setZoom(event.target.value)}><option value="fit">Ajustar à tela</option><option value="actual">100% · tamanho real</option></select></label>
      <div className={styles.toolbarActions}><button title={enabled ? "Desativa a escrita para testar menus, perguntas e carrosséis." : "Ativa a escrita diretamente nos textos do site."} onClick={() => { setEnabled(value => !value); setSelected(null); }}><AdminIcon name={enabled ? "external" : "visual"} />{enabled ? "Testar navegação" : "Voltar à edição"}</button>
      <button aria-expanded={inspector} aria-controls="section-controls" onClick={() => setInspector(value => !value)}>{inspector ? "Ocultar campos" : "Mostrar campos"}</button>
      <div className={styles.undo}><button disabled={busy || !canUndo} onClick={onUndo}>Desfazer</button><button disabled={busy || !canRedo} onClick={onRedo}>Refazer</button></div></div>
    </div>
    <div className={`${styles.layout} ${!inspector ? styles.canvasOnly : ""}`}>
      <div className={styles.canvas}><div className={styles.canvasCaption}><span className={styles.dot} /><span>{enabled ? "Edição ativa · clique em um texto para escrever" : "Teste de navegação · menus e perguntas funcionam sem editar textos"}</span><span>{device === "mobile" ? "390 px" : "Tela ampla"}</span></div>
        {!ready && <div className={styles.loading} role="status">{failed ? <><p>A prévia não respondeu. Confira sua sessão e recarregue.</p><button onClick={() => { setFailed(false); setReload(value => value+1); }}>Recarregar prévia</button></> : "Preparando seu site para editar…"}</div>}
        <div ref={canvas} className={styles.frameViewport} style={{overflow:zoom === "fit" ? "hidden" : "auto"}}><iframe key={`${campaignId}-${reload}`} ref={frame} title="Site com edição visual" src={`/admin/preview?campaign=${campaignId}&edit=1`} className={styles.siteFrame} style={{width:frameWidth,height:canvasSize.height/scale,transform:`scale(${scale})`,left:Math.max(0,(canvasSize.width-frameWidth*scale)/2)}} onLoad={() => {sync();send({type:"ping"});}} /></div>
      </div>
      {inspector && <aside id="section-controls" className={styles.inspector} data-selected={Boolean(selectedField)} aria-label="Controles da seção">
        <label className={styles.sectionSelect}>Parte do site<select value={section} onChange={event => chooseSection(event.target.value)}>{sections.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <div className={styles.context}><h2>{current.title}</h2><p>{current.note}</p>{current.anchor && <button onClick={() => send({type:"focus",section})}>Localizar no site</button>}</div>
        {selectedField && <div className={styles.selection}><div><strong>Você selecionou</strong><button aria-label="Limpar seleção" onClick={() => setSelected(null)}><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div><SectionEditor campaign={campaign} section={section} selectedPath={pathFromId(selected!)} ratio={ratios[selected!]} disabled={busy} onChange={onChange} onChoose={onChoose} search="" /><button onClick={() => send({type:"focus",id:selected})}>Destacar na página</button></div>}
        <p className={styles.hint}>Todos os campos desta seção</p>
        <SectionEditor campaign={campaign} section={section} omitPath={selectedField ? pathFromId(selected!) : undefined} disabled={busy} onChange={onChange} onChoose={onChoose} search="" />
      </aside>}
    </div>
    <p className={styles.footer}>Editar muda o rascunho. Salvar guarda suas alterações. Publicar atualiza o site dos visitantes.</p>
  </div>;
}
