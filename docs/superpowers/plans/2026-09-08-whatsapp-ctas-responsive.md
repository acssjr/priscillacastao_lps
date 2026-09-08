# Responsive WhatsApp CTAs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajustar a hierarquia dos CTAs e oferecer um CTA flutuante de WhatsApp adequado ao desktop sem alterar a experiência mobile existente.

**Architecture:** Reutilizar o componente `MobileStickyCta` e sua lógica de `IntersectionObserver`, renderizando rótulos distintos por breakpoint por meio de elementos controlados por CSS. Manter o efeito luminoso como opção explícita de `WhatsAppLink` e desativá-lo somente para a oferta secundária.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest e Testing Library.

---

### Task 1: Fixar o comportamento esperado em testes

**Files:**
- Modify: `components/landing/SiteHeader.test.tsx`
- Modify: `components/landing/ProofFormats.test.tsx`
- Modify: `components/landing/MobileStickyCta.test.tsx`

- [ ] **Step 1: Escrever testes que exijam o rótulo `AGENDAR`, ausência do elemento luminoso no CTA da dupla e os dois rótulos responsivos do CTA fixo**

- [ ] **Step 2: Executar os três arquivos de teste**

Run: `npm test -- components/landing/SiteHeader.test.tsx components/landing/ProofFormats.test.tsx components/landing/MobileStickyCta.test.tsx`

Expected: FAIL porque a interface atual ainda contém `Conversar`, brilho na oferta em dupla e apenas `AGENDAR MINHA AULA` no CTA fixo.

### Task 2: Implementar os CTAs aprovados

**Files:**
- Modify: `components/landing/SiteHeader.tsx`
- Modify: `components/landing/Formats.tsx`
- Modify: `components/landing/MobileStickyCta.tsx`
- Modify: `components/landing/landing.module.css`

- [ ] **Step 1: Trocar o conteúdo do CTA do cabeçalho por `AGENDAR`**

- [ ] **Step 2: Definir `glow={offer.primary}` no CTA criado pelo mapa de ofertas**

- [ ] **Step 3: Renderizar rótulos separados para mobile e desktop no link fixo**

- [ ] **Step 4: Em `@media (min-width: 48rem)`, transformar a barra em um contêiner transparente no canto inferior direito, ocultar o texto de apoio, exibir o rótulo desktop e preservar área de clique, foco e animação**

- [ ] **Step 5: Executar novamente os três testes focados**

Expected: todos passam.

### Task 3: Verificação completa e visual

**Files:**
- Verify: `components/landing/*`

- [ ] **Step 1: Executar `npm test`, `npm run typecheck`, `npm run lint` e `npm run build`**

Expected: comandos terminam com código 0.

- [ ] **Step 2: Verificar a página em `http://localhost:3001` em desktop e mobile**

Expected: cabeçalho mostra `AGENDAR`; somente a oferta individual brilha; o desktop mostra `AGENDAR AULA` no canto inferior direito após o hero; o mobile preserva a barra existente.
