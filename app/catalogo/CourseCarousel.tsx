"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { FeedbackLink } from "@/components/navigation/FeedbackLink";
import { freeCourses } from "@/content/class-catalog";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import beam from "@/components/ui/WhatsAppLink.module.css";
import styles from "./CourseCarousel.module.css";

const artwork = ["corpo", "musicalidade", "autonomia"];
const labels = ["Perceba seu movimento", "Dance o que você ouve", "Crie o seu caminho"];
gsap.registerPlugin(Flip, useGSAP);

export function CourseCarousel({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const [active, setActive] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [phase, setPhase] = useState<"idle" | "moving">("idle");
  const busy = useRef(false);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const recycled = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x:number; y:number; id:number; horizontal:boolean } | null>(null);
  const dragged = useRef(false);
  const Heading = headingLevel;
  useGSAP(() => {
    if(!flipState.current)return;
    const state=flipState.current;
    flipState.current=null;
    // With only three courses, recycle the far card at the outer edge rather
    // than moving it in the opposite direction through the center of the track.
    if(recycled.current)gsap.fromTo(recycled.current,{opacity:0},{opacity:.38,duration:.28,delay:.16,ease:"power2.out",clearProps:"opacity"});
    recycled.current=null;
    Flip.from(state, {
      duration:.52, ease:"power3.out", scale:true, props:"opacity",
      onComplete:()=>{busy.current=false;setPhase("idle");},
    });
  }, {scope:root,dependencies:[active],revertOnUpdate:true});
  const select = (index:number, immediate = false) => {
    if(busy.current)return;
    const next=(index+freeCourses.length)%freeCourses.length;
    if(next===active)return;
    if(immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches){setActive(next);return;}
    busy.current=true;
    const cards=Array.from(root.current!.querySelectorAll("article"));
    recycled.current=cards.find((_,cardIndex)=>cardIndex!==active && cardIndex!==next) ?? null;
    flipState.current=Flip.getState([cards[active],cards[next]],{props:"opacity"});
    setPhase("moving");
    setActive(next);
  };
  const resetDrag = () => {
    root.current?.querySelectorAll<HTMLElement>("article").forEach(card => card.style.removeProperty("translate"));
    root.current?.removeAttribute("data-dragging");
  };
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      node.toggleAttribute("data-visible", entries[0].isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={styles.carousel} data-keyboard={keyboard || undefined} data-phase={phase}>
    <div className={styles.stage} role="region" aria-roledescription="carrossel" aria-label="Cursos livres"
      onDragStart={event => event.preventDefault()}
      onPointerDown={event => {
        if(busy.current || event.button!==0 || (event.target as HTMLElement).closest("button"))return;
        pointer.current={x:event.clientX,y:event.clientY,id:event.pointerId,horizontal:false};dragged.current=false;setKeyboard(false);
      }}
      onPointerMove={event => {
        const start=pointer.current;if(!start)return;
        const dx=event.clientX-start.x,dy=event.clientY-start.y;
        if(!start.horizontal && Math.abs(dy)>10 && Math.abs(dy)>Math.abs(dx)){pointer.current=null;return;}
        if(!start.horizontal && Math.abs(dx)>8 && Math.abs(dx)>Math.abs(dy)){
          start.horizontal=true;event.currentTarget.setPointerCapture(event.pointerId);root.current?.setAttribute("data-dragging", "");
        }
        if(start.horizontal){
          dragged.current=true;
          root.current?.querySelectorAll<HTMLElement>("article").forEach(card=>{card.style.translate=`${dx*.65}px 0`;});
        }
      }}
      onPointerUp={event => {
        const start=pointer.current;
        if(start?.horizontal && Math.abs(event.clientX-start.x)>45)select(active+(event.clientX<start.x?1:-1));
        pointer.current=null;resetDrag();
        if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onClickCapture={event => { if(dragged.current){event.preventDefault();event.stopPropagation();dragged.current=false;} }}
      onPointerCancel={() => { pointer.current=null;resetDrag(); }}>
      {freeCourses.map((course,index) => {
        const offset = index-active;
        const position = offset === 2 ? -1 : offset === -2 ? 1 : offset;
        return <article key={course.title} className={styles.card} data-course={artwork[index]} data-active={index===active} data-position={position} aria-hidden={index!==active} inert={index!==active}>
          <span className={styles.reflection} aria-hidden="true" />
          <span className={styles.borderBeam} aria-hidden="true"><span className={beam.rim} /></span>
          <div className={styles.art}><Image src={`/images/catalogo-curso-${artwork[index]}.webp`} alt="" fill unoptimized /></div>
          <div className={styles.copy}><span className={styles.eyebrow}>{labels[index]}</span><Heading data-title={course.title} aria-label={course.title}>{course.title}</Heading><p>{course.text}</p><strong>{course.amount}</strong>
            <FeedbackLink href={buildWhatsAppUrl(forroDoZeroCampaign.whatsapp.phone,`Oi, Priscilla! Quero adquirir o curso de ${course.title.toLowerCase()}. Podemos conversar?`)} target="_blank" rel="noopener noreferrer" feedback="Abrindo o WhatsApp…" className={styles.action}>Quero adquirir esse curso <span aria-hidden="true">↗</span></FeedbackLink>
          </div>
        </article>;
      })}
      <button className={`${styles.edge} ${styles.previous}`} aria-disabled={phase!=="idle"} onClick={event => { setKeyboard(event.detail===0);select(active-1,event.detail===0); }} aria-label="Curso anterior"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg></button>
      <button className={`${styles.edge} ${styles.next}`} aria-disabled={phase!=="idle"} onClick={event => { setKeyboard(event.detail===0);select(active+1,event.detail===0); }} aria-label="Próximo curso"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>
    </div>
    <p className={styles.announcement} aria-live="polite" aria-atomic="true">{active+1} de 3 · {freeCourses[active].title}</p>
  </div>;
}
