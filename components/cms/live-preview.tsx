"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { sections } from "@/lib/cms/catalog";
import { changeText, editableField } from "@/lib/cms/editor-structure";
import { EditContext } from "./edit-context";
import { PreviewPhotoActions } from "./preview-photo-actions";
import "./visual-preview.css";
function send(message: Record<string,unknown>) { window.parent.postMessage({ channel:"priscilla-editor", ...message },window.location.origin); }
export function LivePreview({ initial, editable = false }: { initial: LandingCampaign; editable?: boolean }) {
  const [campaign,setCampaign] = useState(initial);
  const [enabled,setEnabled] = useState(editable);
  const [selected,setSelected] = useState<string|null>(null);
  const current = useRef(initial);
  const select = useCallback((id: string) => {
    if (!editableField(current.current,id)) return;
    setSelected(id); send({type:"select",id});
    const image = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-cms-image]")).find(node => node.dataset.cmsImage === id);
    if (image) { const rect = image.getBoundingClientRect(); if (rect.height > 0) send({type:"photo-frame",id,ratio:rect.width/rect.height}); }
  },[]);
  const change = useCallback((id: string,value: string) => {
    const field = editableField(current.current,id);
    if (!field || field.kind !== "text" || value.length > 6000) return;
    current.current = changeText(current.current,field.path,value);
    // The uncontrolled span owns the caret; its parent synchronizes values.
    send({type:"change",id,value});
  },[]);
  useLayoutEffect(() => {
    document.documentElement.dataset.visualEditor = "true";
    return () => { delete document.documentElement.dataset.visualEditor; };
  },[]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.channel !== "priscilla-editor") return;
      const message = event.data;
      if (message.type === "ping") send({type:"ready"});
      if (message.type === "sync" && message.campaign?.id === initial.id) {
        current.current = message.campaign;
        const safe = { ...current.current, whatsapp: { ...current.current.whatsapp,
          phone: /^55\d{10,11}$/.test(current.current.whatsapp.phone) ? current.current.whatsapp.phone : initial.whatsapp.phone,
          messages: Object.fromEntries(Object.entries(current.current.whatsapp.messages).map(([key,value]) => [key,value.trim() ? value : initial.whatsapp.messages[key as keyof typeof initial.whatsapp.messages]])) as typeof initial.whatsapp.messages,
        } };
        setCampaign(safe); setEnabled(editable && message.enabled !== false);
        setSelected(editableField(current.current,message.selected) ? message.selected : null);
      }
      if (message.type === "scale" && typeof message.value === "number" && message.value > 0 && message.value <= 1) document.documentElement.style.setProperty("--cms-action-scale",String(1/message.value));
      if (message.type === "focus") {
        const section = sections.find(section => section.id === message.section);
        const anchor = section?.id === "proof" ? current.current.proof.anchor : section?.id === "closing" ? "closing-title" : section?.anchor;
        const field = editableField(current.current,message.id);
        const target = field ? Array.from(document.querySelectorAll<HTMLElement>("[data-cms-field],[data-cms-image]")).find(node => (node.dataset.cmsField || node.dataset.cmsImage) === message.id)
          : section?.id === "navigation" ? document.querySelector("header") : anchor ? document.getElementById(anchor) : null;
        target?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",block:"start"});
      }
    }
    window.addEventListener("message",receive); send({type:"ready"});
    return () => window.removeEventListener("message",receive);
  },[initial,editable]);
  useEffect(() => {
    function protect(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const photo = event.target.closest<HTMLElement>("[data-cms-photo-action]");
      if (enabled && photo?.dataset.cmsPhotoAction) { event.preventDefault(); event.stopPropagation(); select(photo.dataset.cmsPhotoAction); send({type:"choose-image",id:photo.dataset.cmsPhotoAction}); return; }
      const field = event.target.closest<HTMLElement>("[data-cms-field],[data-cms-image]");
      if (enabled && field) {
        const id = field.dataset.cmsField || field.dataset.cmsImage;
        if (id) select(id);
        if (event.target.closest("a,button,summary")) { event.preventDefault(); event.stopPropagation(); if (field.isContentEditable) field.focus(); }
        return;
      }
      if (event.target.closest("a")) { event.preventDefault(); event.stopPropagation(); }
    }
    const submit = (event: Event) => event.preventDefault();
    document.addEventListener("click",protect,true); document.addEventListener("submit",submit,true);
    return () => { document.removeEventListener("click",protect,true); document.removeEventListener("submit",submit,true); };
  },[enabled,select]);
  return <EditContext.Provider value={{enabled,selected,select,change}}><div data-admin-preview><LandingPage campaign={campaign} preview /><PreviewPhotoActions enabled={enabled} /></div></EditContext.Provider>;
}
