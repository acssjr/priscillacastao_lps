"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { fieldLabel } from "@/lib/cms/catalog";
export type Editing = { enabled: boolean; selected: string | null; select: (id: string) => void; change: (id: string, value: string) => void };
export const EditContext = createContext<Editing | null>(null);
export function useVisualEditing() { return useContext(EditContext); }
export function readEditableText(root: HTMLElement): string {
  // innerText applies CSS uppercase to the source. Preserve original case and
  // still keep the line breaks that browsers create for Enter in contentEditable.
  let result = "";
  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === 3) result += child.textContent ?? "";
    else if (child instanceof HTMLElement) {
      if (child.tagName === "BR") result += "\n";
      else { if (["DIV","P"].includes(child.tagName) && result && !result.endsWith("\n")) result += "\n"; result += readEditableText(child); }
    }
  }
  return result;
}

/** Explicit paths avoid ambiguous bindings when two sections use the same text. */
export function CmsText({ field, value, children, emphasis }: { field: string; value: string; children?: ReactNode; emphasis?: { phrase: string; className: string } }) {
  const editing = useVisualEditing();
  if (!editing?.enabled) return <>{children ?? value}</>;
  return <EditableText field={field} value={value} editing={editing} emphasis={emphasis} />;
}
function EditableText({ field, value, editing, emphasis }: { field: string; value: string; editing: Editing; emphasis?: { phrase: string; className: string } }) {
  const parts = field.split(".");
  const last = parts.at(-1)!;
  const label = /^\d+$/.test(last) ? `${fieldLabel(parts.at(-2)!)} ${Number(last)+1}` : fieldLabel(last);
  const element = useRef<HTMLSpanElement>(null);
  const [initial] = useState(value);
  useEffect(() => {
    const node = element.current;
    if (!node || document.activeElement === node) return;
    const index = emphasis ? value.toLocaleLowerCase("pt-BR").indexOf(emphasis.phrase.toLocaleLowerCase("pt-BR")) : -1;
    if (emphasis && index >= 0) {
      const mark = document.createElement("strong"); mark.className = emphasis.className;
      mark.textContent = value.slice(index, index + emphasis.phrase.length);
      node.replaceChildren(document.createTextNode(value.slice(0,index)),mark,document.createTextNode(value.slice(index + emphasis.phrase.length)));
    } else node.textContent = value;
  }, [value, emphasis]);
  function change(node: HTMLSpanElement) {
    const raw = readEditableText(node);
    const text = raw.slice(0,6000);
    if (raw.length > 6000) node.textContent = text;
    editing.change(field,text);
  }
  return <span ref={element} data-cms-field={field} data-cms-selected={editing.selected === field} contentEditable suppressContentEditableWarning role="textbox" aria-label={`Editar: ${label}`} aria-multiline="true" tabIndex={0}
    onFocus={() => editing.select(field)} onInput={event => change(event.currentTarget)}
    onPaste={event => {
      event.preventDefault();
      const selection = window.getSelection(), range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      if (!range || !event.currentTarget.contains(range.commonAncestorContainer)) return;
      range.deleteContents(); const node = document.createTextNode(event.clipboardData.getData("text/plain").slice(0,6000));
      range.insertNode(node); range.setStartAfter(node); range.collapse(true); selection?.removeAllRanges(); selection?.addRange(range);
      change(event.currentTarget);
    }}>{initial}</span>;
}
