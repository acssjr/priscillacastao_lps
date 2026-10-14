"use client";
/* Thumbnails and brand SVG use native images; public photography uses next/image. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { campaignIds, campaignNames, defaults, sections, editableKeys, validateContent, type ContentValues } from "@/lib/cms/catalog";
import type { CampaignId } from "@/content/landing-pages/registry";
import type { Snapshot } from "@/lib/cms/snapshot";
import { setAt, type FieldPath } from "./section-editor";
import { changeText } from "@/lib/cms/editor-structure";
import { VisualEditor } from "./visual-editor";
import { AdminSidebar, useAdminSidebar } from "./admin-sidebar";
import { AccessLoading } from "./access-loading";
import { PublicationDialog, type PublicationReceipt } from "./publication-dialog";
import { MediaLibrary } from "./media-library";
import { UsersPanel } from "./users-panel";
import { Modal } from "./modal";
import styles from "./admin-panel.module.css";

type Mode = "editor" | "login" | "unavailable";
type View = "editor" | "overview" | "media" | "history" | "users" | "account" | "help";
const date = (value: string | null) => value ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Bahia" }) : "Conteúdo original";
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function changedSections(values: ContentValues, published: ContentValues) {
  return campaignIds.flatMap(id => sections.filter(section => editableKeys(section.id).some(key => !equal(values[id][key as keyof typeof values[typeof id]], published[id][key as keyof typeof published[typeof id]]))).map(section => ({ id: id + section.id, campaign: campaignNames[id], section: section.title })));
}

export function AdminPanel({ mode, initial }: { mode: Mode; initial?: Snapshot }) {
  const router = useRouter();
  const { shell, compact, toggle } = useAdminSidebar();
  const [accessStage,setAccessStage] = useState<"authenticating" | "opening" | null>(null);
  const [receipt,setReceipt] = useState<PublicationReceipt|null>(null);
  const [snapshot, setSnapshot] = useState(initial);
  const [values, setValues] = useState<ContentValues>(initial?.draft || defaults);
  const [campaignId, setCampaignId] = useState<CampaignId>("forro-do-zero");
  const [sectionId, setSectionId] = useState("hero");
  const [view, setView] = useState<View>("editor");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [imagePath, setImagePath] = useState<FieldPath | null>(null);
  const [confirmation, setConfirmation] = useState<"publish" | "discard" | "reset" | { restore: string } | null>(null);
  const [past, setPast] = useState<ContentValues[]>([]);
  const [future, setFuture] = useState<ContentValues[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const dirty = !equal(values, snapshot?.draft || defaults);
  const changes = changedSections(values, snapshot?.published || defaults);
  const savedPending = snapshot && !equal(snapshot.draft, snapshot.published);

  useEffect(() => {
    document.documentElement.dataset.admin = "true";
    return () => { delete document.documentElement.dataset.admin; };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  useEffect(() => {
    if (!preview) return;
    const sync = () => frame.current?.contentWindow?.postMessage({channel:"priscilla-editor",type:"sync",campaign:values[campaignId],enabled:false},window.location.origin);
    sync();
    const receive = (event: MessageEvent) => { if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.channel === "priscilla-editor" && event.data.type === "ready") sync(); };
    window.addEventListener("message",receive); return () => window.removeEventListener("message",receive);
  },[preview,values,campaignId]);

  function edit(next: ContentValues) {
    setPast(list => [...list.slice(-29), values]); setFuture([]); setValues(next); setNotice(""); setError("");
  }
  function update(path: FieldPath, value: unknown) { edit({ ...values, [campaignId]: typeof value === "string" ? changeText(values[campaignId], path, value) : setAt(values[campaignId], path, value) }); }
  function undo() {
    if (!past.length) return;
    setFuture(list => [values, ...list]); setValues(past.at(-1)!); setPast(list => list.slice(0, -1));
  }
  function redo() {
    if (!future.length) return;
    setPast(list => [...list, values]); setValues(future[0]); setFuture(list => list.slice(1));
  }
  async function call(action: string, extra: Record<string, unknown> = {}) {
    if (pending.current) return null;
    pending.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, revision: snapshot?.revision, ...extra }), signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível concluir.");
      if (result.draft) { setSnapshot(result); setValues(result.draft); setPast([]); setFuture([]); }
      return result;
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Não foi possível concluir. Tente novamente."); return null; }
    finally { pending.current = false; setBusy(false); }
  }
  async function save() {
    try { validateContent(values); } catch (failure) { setError((failure as Error).message); return; }
    if (await call("save", { values })) setNotice("Rascunho salvo. Você pode fechar o painel e continuar depois.");
  }
  async function upload(file: File) {
    if (pending.current) return;
    if (file.size > 3000000) { setError("A imagem deve ter até 3 MB."); return; }
    pending.current = true; setBusy(true); setError("");
    try {
      const form = new FormData(); form.append("file", file); form.append("revision", String(snapshot?.revision));
      const response = await fetch("/api/admin/media", { method: "POST", body: form, signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSnapshot(result.snapshot);
      setNotice("Imagem adicionada à biblioteca. Escolha Usar esta imagem para aplicá-la.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Não foi possível enviar a imagem."); }
    finally { pending.current = false; setBusy(false); }
  }
  async function confirm() {
    if (confirmation === "reset") {
      let next = values[campaignId];
      for (const key of editableKeys(sectionId)) next = setAt(next, [key], defaults[campaignId][key as keyof typeof next]);
      edit({ ...values, [campaignId]: next }); setConfirmation(null); return;
    }
    const action = confirmation === "publish" ? "publish" : confirmation === "discard" ? "discard" : "restore";
    const extra = typeof confirmation === "object" && confirmation ? { id: confirmation.restore } : action === "publish" ? { values, label: "Publicação pelo painel" } : {};
    const result = await call(action, extra);
    if (result) {
      setConfirmation(null);
      if (action === "publish") setReceipt({ publishedAt:result.publishedAt, local:result.storage === "local", count:changes.length, route:values[campaignId].route });
      setNotice(action === "publish" ? (result.storage === "local" ? "Publicado na versão local. O domínio oficial não foi alterado." : "As alterações foram publicadas no site.") : action === "restore" ? "Versão recuperada como rascunho. Confira a prévia antes de publicar." : "Rascunho descartado. O editor voltou ao conteúdo publicado.");
    }
  }
  async function access(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setAccessStage("authenticating");
    const result = await call(mode, form);
    if (result) { setAccessStage("opening"); router.replace("/admin"); router.refresh(); } else setAccessStage(null);
  }
  async function password(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget, data = Object.fromEntries(new FormData(element));
    if (data.password !== data.confirm) { setError("As senhas precisam ser iguais."); return; }
    if (await call("password", data)) { element.reset(); setNotice("Senha atualizada. As outras sessões foram encerradas."); }
  }
  function navigate(next: View) { setView(next); setMenu(false); setError(""); setNotice(""); }
  async function signOut() {
    if (dirty) { setError("Salve o rascunho ou descarte as alterações antes de sair."); return; }
    if (await call("logout")) { router.refresh(); }
  }

  if (mode !== "editor" || !snapshot) { if (accessStage) return <AccessLoading stage={accessStage} />; return <main id="conteudo" className={styles.access}>
    <div className={styles.accessBrand}><img src="/favicon.svg" alt="" /><span>Priscilla Castão</span></div>
    <section className={styles.accessContent}><h1>{mode === "unavailable" ? "Painel indisponível" : "Seu site, nas suas mãos."}</h1>
      <p>{mode === "unavailable" ? "O armazenamento do painel precisa ser configurado. Peça ao responsável pelo site para conferir a configuração." : "Entre para editar textos, trocar fotos e publicar as três versões da sua página."}</p>
      {mode !== "unavailable" && <form onSubmit={access}>
        <label>Usuário<input name="username" autoComplete="username" required minLength={3} maxLength={32} /></label>
        <label>Senha<input type="password" name="password" autoComplete="current-password" required maxLength={128} /></label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className={styles.primary} disabled={busy}>{busy ? "Abrindo o painel…" : "Entrar no painel"}</button>
      </form>}
      <Link href="/">Voltar para o site</Link>
    </section><p className={styles.accessFoot}>Conteúdo, imagens e publicação em um só lugar.</p>
  </main>; }

  return <div ref={shell} className={styles.shell} data-compact={compact}>
    <AdminSidebar compact={compact} toggle={toggle} mobileOpen={menu} onClose={() => setMenu(false)} view={view === "editor" ? "visual" : view} navigate={next => navigate(next === "visual" ? "editor" : next as View)} admin={snapshot.user.role === "admin"} busy={busy} onLogout={signOut} />
    {menu && <button className={styles.navScrim} aria-label="Fechar navegação ao tocar fora" onClick={() => setMenu(false)} />}
    <div className={styles.workspace} data-admin-workspace="">
      <header className={styles.toolbar}><button className={styles.mobileMenu} onClick={() => setMenu(true)} aria-expanded={menu}>Menu</button>
        <div className={styles.status}><strong>Seu site <span aria-hidden="true">/</span> {view === "editor" ? "Edição visual" : view === "overview" ? "Visão geral" : view === "media" ? "Biblioteca de imagens" : view === "history" ? "Histórico de versões" : view === "users" ? "Usuários" : view === "account" ? "Minha conta" : "Como usar"}</strong><span>{dirty ? "Alterações por salvar" : savedPending ? "Rascunho salvo · publicação pendente" : "Tudo publicado"}</span></div>
        <div className={styles.toolbarActions}><button disabled={busy} onClick={() => setPreview(true)}>Ver prévia</button><button className={styles.primary} disabled={busy || !changes.length} onClick={() => { try { validateContent(values); setConfirmation("publish"); } catch (failure) { setError((failure as Error).message); } }}>Publicar</button></div>
      </header>
      <main id="conteudo" className={`${styles.main} ${view === "editor" ? styles.visualMain : ""}`}>
        <div className={styles.feedback} aria-live="polite">{!imagePath && notice && <p className={styles.success} role="status">{notice}</p>}{!imagePath && !confirmation && error && <p className={styles.error} role="alert">{error}</p>}</div>
        {view === "editor" && <VisualEditor campaignId={campaignId} campaign={values[campaignId]} section={sectionId} onCampaign={setCampaignId} onSection={setSectionId} onChange={update} onChoose={setImagePath} onSave={save} onUndo={undo} onRedo={redo} canUndo={past.length > 0} canRedo={future.length > 0} busy={busy} dirty={dirty} />}
        {view === "overview" && <section className={styles.overview}><h1>Seu site, nas suas mãos.</h1><p>Edite diretamente na página ou use os controles da seção. Suas alterações só chegam aos visitantes quando você publica.</p><div className={styles.overviewState}><h2>{dirty ? "Há alterações por salvar" : savedPending ? "Seu rascunho está salvo" : "Tudo publicado"}</h2><p>Última publicação: {date(snapshot.publishedAt)}</p><p>{snapshot.storage === "local" ? "Você está no ambiente local." : "As publicações atualizam o site público."}</p><button disabled={busy || !dirty} onClick={save}>Salvar rascunho</button><button disabled={busy || (!dirty && !savedPending)} onClick={() => setConfirmation("discard")}>Descartar rascunho</button></div><h2>Suas três páginas</h2><ul className={styles.pageList}>{campaignIds.map(id => <li key={id}><div><strong>{campaignNames[id]}</strong><p>{changedSections(values,snapshot.published).filter(change => change.campaign === campaignNames[id]).length} seções com alterações pendentes</p></div><button onClick={() => { setCampaignId(id); navigate("editor"); }}>Editar no site</button><Link href={values[id].route} target="_blank">Abrir página</Link></li>)}</ul><button onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify({exportedAt:new Date().toISOString(),values},null,2)],{type:"application/json"})); const link = document.createElement("a"); link.href=url; link.download="priscilla-conteudo.json"; link.click(); URL.revokeObjectURL(url); }}>Baixar cópia do conteúdo</button></section>}
        {view === "media" && <><h1>Biblioteca de imagens</h1><MediaLibrary media={snapshot.media} busy={busy} onUpload={upload} /></>}
        {view === "history" && <><h1>Histórico de publicações</h1><p>Cada publicação guarda o conteúdo anterior das três páginas. Recupere uma versão como rascunho e confira antes de publicar.</p><p>Última publicação: {date(snapshot.publishedAt)}</p>{!snapshot.history.length ? <p className={styles.empty}>As versões anteriores aparecerão aqui após a primeira publicação.</p> : <ul className={styles.history}>{snapshot.history.map(version => <li key={version.id}><div><strong>{version.label}</strong><p>Conteúdo anterior à publicação de {date(version.date)}</p></div><button disabled={busy} onClick={() => setConfirmation({ restore: version.id })}>Recuperar como rascunho</button></li>)}</ul>}
          <hr /><button disabled={busy || (!dirty && !savedPending)} onClick={() => setConfirmation("discard")}>Descartar rascunho e voltar ao publicado</button></>}
        {view === "users" && snapshot.user.role === "admin" && <UsersPanel current={snapshot.user} onCurrentChange={user => setSnapshot(current => current ? { ...current, user } : current)} />}
        {view === "account" && <section className={styles.account}><h1>Minha conta</h1><p>{snapshot.user.name} · @{snapshot.user.username}</p><h2>Alterar senha</h2><form onSubmit={password}><label>Senha atual<input type="password" name="current" autoComplete="current-password" required maxLength={128} /></label><label>Nova senha<input type="password" name="password" required minLength={8} maxLength={128} autoComplete="new-password" /></label><label>Repita a nova senha<input type="password" name="confirm" required minLength={8} maxLength={128} autoComplete="new-password" /></label><small>Use pelo menos 8 caracteres. As outras sessões serão encerradas.</small><button className={styles.primary} disabled={busy}>Atualizar senha</button></form></section>}
        {view === "help" && <section className={styles.helpPage}><h1>Como cuidar do seu site</h1><h2>Escolha a página e a seção</h2><p>O seletor acima do site alterna entre as três versões. Clique em um texto no site para escrever ali mesmo ou edite no controle correspondente. Use Parte do site para localizar uma seção.</p><h2>Salve sem publicar</h2><p>Salvar rascunho guarda as mudanças no painel. A página pública continua com a última publicação. Você pode editar várias seções e páginas antes de publicar.</p><h2>Confira a prévia</h2><p>Testar navegação desativa a escrita para testar menus, perguntas e carrosséis. Voltar à edição reativa os textos. Mostrar campos abre os controles da seção; Ocultar campos amplia a área do site; Ver prévia mostra as alterações, inclusive as que você ainda não salvou. Alterne entre computador e celular. Os links externos ficam desativados nessa prévia.</p><h2>Publique quando estiver pronto</h2><p>Publicar mostra quais páginas e seções mudaram. Ao confirmar, todas as alterações indicadas entram no ar juntas.</p><h2>Troque fotos com cuidado</h2><p>Use Alterar foto sobre a imagem ou Trocar imagem nos controles. Escolha uma imagem existente ou envie uma nova. Descreva a imagem e arraste o ponto de foco para ajustar o enquadramento.</p><h2>Recupere uma versão</h2><p>No Histórico, recupere o conteúdo anterior como rascunho. Confira a prévia e publique para colocá-lo novamente no site.</p><h2>Acessos ao painel</h2><p>Administradores podem criar usuários e revogar acessos. Editores podem editar e publicar o site. Guarde seu usuário e sua senha em um lugar privado.</p></section>}
      </main>
    </div>
    {imagePath && <Modal title="Escolher imagem" wide onClose={() => !busy && setImagePath(null)}><div aria-live="polite">{error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.success}>{notice}</p>}</div><MediaLibrary media={snapshot.media} busy={busy} onUpload={upload} onChoose={asset => {
      let next = setAt(values[campaignId], [...imagePath,"src"], asset.src);
      next = setAt(next,[...imagePath,"width"],asset.width); next = setAt(next,[...imagePath,"height"],asset.height);
      next = setAt(next,[...imagePath,"position"],"50% 50%"); edit({ ...values, [campaignId]: next }); setImagePath(null);
    }} /></Modal>}
    {preview && <Modal title={"Prévia · " + campaignNames[campaignId]} wide onClose={() => setPreview(false)}><div className={styles.previewTools}><div><button aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Computador</button><button aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Celular</button></div><span>Prévia das alterações ainda não publicadas. Links externos desativados.</span></div><div className={styles.previewStage}><iframe ref={frame} className={device === "mobile" ? styles.mobileFrame : styles.desktopFrame} title={"Prévia de " + campaignNames[campaignId]} src={"/admin/preview?campaign=" + campaignId} /></div></Modal>}
    {(confirmation === "publish" || receipt) && <PublicationDialog stage={receipt ? "success" : busy ? "publishing" : "confirm"} receipt={receipt} groups={campaignIds.map(id => ({name:campaignNames[id],count:changes.filter(change => change.campaign === campaignNames[id]).length})).filter(group => group.count > 0)} local={snapshot.storage === "local"} error={error} onPublish={confirm} onClose={() => { if (!busy) { setConfirmation(null); setReceipt(null); } }} />}
    {confirmation && confirmation !== "publish" && <Modal title={confirmation === "reset" ? "Restaurar esta seção?" : confirmation === "discard" ? "Descartar o rascunho?" : "Recuperar versão anterior?"} onClose={() => !busy && setConfirmation(null)}>
      <p>{confirmation === "reset" ? "Os campos desta seção voltarão ao conteúdo original. Você poderá desfazer antes de salvar." : confirmation === "discard" ? "As alterações salvas e não salvas serão substituídas pelo conteúdo publicado nas três páginas." : "O conteúdo das três páginas será recuperado como rascunho. O site só mudará quando você publicar."}</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.dialogActions}><button disabled={busy} onClick={() => setConfirmation(null)}>Cancelar</button><button className={styles.primary} disabled={busy} onClick={confirm}>{busy ? "Aguarde…" : confirmation === "reset" ? "Restaurar seção" : confirmation === "discard" ? "Descartar rascunho" : "Recuperar rascunho"}</button></div>
    </Modal>}
  </div>;
}
