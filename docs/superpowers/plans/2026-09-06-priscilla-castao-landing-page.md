# Priscilla Castão Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e publicar uma landing page mobile-first para pessoas de Salvador que querem aprender forró do zero com segurança, convertendo visitas de Instagram, Google Ads e Meta Ads em conversas qualificadas no WhatsApp de Priscilla Castão.

**Architecture:** Uma aplicação Next.js App Router renderiza conteúdo de campanha validado no servidor. Componentes clientes ficam restritos a WhatsApp com telemetria, consentimento, CTA móvel e movimento progressivo; a estrutura admite novas campanhas por configuração e rota, sem CMS ou duplicação da aplicação.

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript 5.9.3, Zod 4.5.4, CSS Modules, GSAP 3.15.0, `@gsap/react` 2.1.2, Vitest 5.0.0, Testing Library, Playwright 1.63.0, Axe 4.13.0, Lighthouse CI 0.15.1 e npm.

**Spec:** `docs/superpowers/specs/2026-09-06-priscilla-castao-landing-page-design.md`

## Global Constraints

- O projeto é mobile-first e precisa funcionar em 320, 375, 390, 768, 1024 e 1440 px.
- Corpo de texto móvel usa no mínimo 16 px, entrelinha de 1,5 a 1,75 e 35 a 60 caracteres por linha.
- Alvos de toque têm pelo menos 48 × 48 px e 8 px de separação.
- Contraste de texto normal é de pelo menos 4,5:1; zoom nunca é desativado.
- O scroll é nativo; não existe parallax no mobile nem conteúdo essencial oculto por animação.
- `prefers-reduced-motion` entrega o estado final completo e estático.
- O conceito visual é “Presença em movimento”, com transições claras de fundo entre capítulos e no máximo três momentos de animação.
- Evitar estética genérica de festa junina, glassmorphism, ícones óbvios de dança, excesso de cartões e decoração sem função.
- Quebras de headline são responsivas e não usam espaços inseparáveis generalizados.
- A paleta fixa é `#64121F`, `#4B0D17`, `#7A1D2A`, `#AE6664`, `#F1E2C9`, `#FAF5EC` e `#342522`; rosa queimado entra somente como detalhe.
- Plus Jakarta Sans é a fonte funcional; Newsreader é uma candidata editorial e só permanece após teste de legibilidade.
- Aula individual é a oferta dominante; aula em dupla é complementar.
- A narrativa segue Revenue Centric Design: intenção do anúncio, reconhecimento, redução de risco, prova, escolha de formato e ação mensurável; cada seção precisa justificar sua presença nesse percurso.
- A mensagem estratégica é aprender do zero com segurança, em ambiente reservado, com atenção individual e progressão no próprio ritmo.
- A redação final depende de `schwartz-copy`, princípios de Ogilvy, `no-ai-slop` e aprovação do usuário.
- O WhatsApp usa o número normalizado `5575981234176`.
- Investimento e local em Salvador são combinados depois de uma conversa consultiva.
- Google Ads, GA4 e Meta Ads são geridos por Google Tag Manager após consentimento.
- Analytics nunca recebe nome, telefone ou conteúdo da conversa e nunca bloqueia o WhatsApp.
- Metas: LCP < 2,5 s, CLS < 0,1, INP < 200 ms e Lighthouse móvel ≥ 90 em produção.
- O repositório público final é `https://github.com/acssjr/priscillacastao_lps`, branch `main`.
- Não entram no repositório: `.venv`, ferramentas clonadas, referências, diagnósticos, metadados brutos, segredos ou JPEGs originais.
- Aplicar TDD, revisar cada tarefa e criar commits pequenos.

---

## File Structure

### Project and tooling

- `.gitignore`: exclui ambientes, ferramentas, referências, originais e segredos.
- `.env.example`: documenta somente variáveis públicas e IDs de integração.
- `README.md`: documenta execução, arquitetura, conteúdo, analytics e publicação.
- `package.json`: fixa scripts e versões da aplicação.
- `next.config.ts`: configura imagens e análise opcional do bundle.
- `tsconfig.json`: ativa modo estrito e alias `@/*`.
- `eslint.config.mjs`: regras de Next.js e TypeScript.
- `vitest.config.ts`: testes de unidade e componentes em JSDOM.
- `vitest.setup.ts`: matchers e limpeza do DOM.
- `playwright.config.ts`: testes ponta a ponta em servidor local.
- `lighthouserc.cjs`: orçamento de desempenho e acessibilidade.

### Application shell

- `app/layout.tsx`: fontes, metadados-base, consentimento e estrutura do documento.
- `app/page.tsx`: seleciona e renderiza a campanha `forro-do-zero`.
- `app/globals.css`: reset, tokens globais, acessibilidade e regras base mobile-first.
- `app/robots.ts`: indexação.
- `app/sitemap.ts`: sitemap da raiz e política de privacidade.
- `app/opengraph-image.tsx`: imagem social gerada pela aplicação.
- `app/politica-de-privacidade/page.tsx`: política de privacidade e tracking.
- `app/politica-de-privacidade/privacy.module.css`: leitura da política.

### Campaign domain

- `content/landing-pages/schema.ts`: schemas Zod e tipos de campanha.
- `content/landing-pages/forro-do-zero.ts`: copy, depoimentos, ativos e mensagens aprovados.
- `content/landing-pages/registry.ts`: registro fechado das campanhas.
- `content/landing-pages/schema.test.ts`: valida conteúdo e invariantes comerciais.
- `docs/content/forro-do-zero-copy.md`: diagnóstico, copy aprovada e fontes de prova.

### Shared libraries

- `lib/site-url.ts`: resolve URL pública sem inventar domínio.
- `lib/site-url.test.ts`: valida domínio explícito, Vercel e fallback local.
- `lib/whatsapp.ts`: normaliza número e cria URLs.
- `lib/whatsapp.test.ts`: cobre número, encoding e erros.
- `lib/analytics.ts`: contrato de eventos e `dataLayer` tolerante a falha.
- `lib/analytics.test.ts`: privacidade, consentimento e não bloqueio.
- `lib/consent.ts`: estado persistido de consentimento.
- `lib/consent.test.ts`: leitura, escrita e valores inválidos.

### Landing components

- `components/landing/LandingPage.tsx`: composição sem lógica de campanha.
- `components/landing/SiteHeader.tsx`: marca, âncoras e CTA.
- `components/landing/Hero.tsx`: primeira dobra e imagem LCP.
- `components/landing/Recognition.tsx`: tensões de quem começa.
- `components/landing/Method.tsx`: três fundamentos.
- `components/landing/Proof.tsx`: capa, fatos e depoimentos.
- `components/landing/Formats.tsx`: individual e dupla.
- `components/landing/About.tsx`: apresentação da professora.
- `components/landing/ProcessFaq.tsx`: processo e dúvidas.
- `components/landing/FinalCta.tsx`: conversão final.
- `components/landing/SiteFooter.tsx`: Instagram, privacidade e identidade.
- `components/landing/MobileStickyCta.tsx`: CTA condicional mobile.
- `components/landing/landing.module.css`: layout e ritmo visual da LP.
- `components/landing/LandingPage.test.tsx`: semântica e conteúdo.
- `components/landing/MobileStickyCta.test.tsx`: visibilidade por interseção.

### Motion enhancement

- `components/motion/MotionLoader.tsx`: carrega movimento depois do conteúdo.
- `components/motion/MotionLayer.tsx`: GSAP com redução de movimento.
- `components/motion/MotionLayer.test.tsx`: estado estático e limpeza.

### Interaction and tracking components

- `components/ui/WhatsAppLink.tsx`: link resiliente com evento opcional.
- `components/ui/WhatsAppLink.test.tsx`: href, evento e falha de analytics.
- `components/ui/TrackedExternalLink.tsx`: mede acesso à prova sem bloquear o link.
- `components/ui/TrackedDetails.tsx`: mede abertura de FAQ mantendo `details/summary` nativo.
- `components/ui/TrackedInteractions.test.tsx`: cobre eventos de formato, prova e FAQ.
- `components/tracking/ConsentBanner.tsx`: aceitar ou rejeitar tags.
- `components/tracking/ConsentBanner.module.css`: banner móvel seguro.
- `components/tracking/ConsentControl.tsx`: permite alterar a escolha depois pelo rodapé.
- `components/tracking/TagManager.tsx`: injeta GTM somente após consentimento.
- `components/tracking/TrackingRoot.tsx`: coordena consentimento e tags.
- `components/tracking/TrackingRoot.test.tsx`: garante bloqueio e ativação.

### Public assets

- `public/brand/priscilla-castao-logo.svg`: lockup horizontal do cabeçalho.
- `public/brand/priscilla-castao-mark.svg`: marca quadrada para ícones.
- `public/images/priscilla-castao-ensaio-01.webp`: hero.
- `public/images/priscilla-castao-ensaio-02.webp`: método.
- `public/images/priscilla-castao-ensaio-03.webp`: sobre.
- `public/images/priscilla-castao-forro-roots-capa.webp`: prova.

### End-to-end tests

- `e2e/landing.spec.ts`: conteúdo, formatos, FAQ, viewports, overflow, sticky CTA e WhatsApp.
- `e2e/accessibility.spec.ts`: Axe, teclado, zoom e redução de movimento.
- `e2e/tracking.spec.ts`: consentimento, dataLayer e navegação resiliente.

---

### Task 1: Approve campaign copy and proof

**Execution note (2026-09-07):** Instagram and Instaloader could not read the `Feedbacks` highlight without authentication. At the user's explicit request, this prototype uses three fictitious, visibly labeled demonstration testimonials. They are not evidence and must be replaced before publication.

**Files:**
- Create: `docs/content/forro-do-zero-copy.md`
- Read: `docs/research/instagram-priscilla-castao.md`
- Read: `docs/direction/direcao-visual-priscilla-castao.md`
- Read: `docs/superpowers/specs/2026-09-06-priscilla-castao-landing-page-design.md`
- Read: `assets/instagram/DW1kXWEkYEa/originais/DW1kXWEkYEa_2026-04-07_16-22-52_UTC.txt`

**Interfaces:**
- Consumes: mensagem estratégica, fatos confirmados, publicações públicas e depoimentos do Instagram.
- Produces: documento aprovado com campos `hero`, `recognition`, `method`, `proof`, `formats`, `about`, `process`, `faq`, `closing` e mensagens `individual`/`dupla`.

- [x] **Step 1: Create the evidence ledger before writing copy**

Crie o documento com esta estrutura e preencha cada evidência com URL pública, nome e texto literal ou paráfrase identificada:

```markdown
# Copy aprovada: forró do zero

## Fatos confirmados
- Professora: Priscilla Castão
- Cidade: Salvador, BA
- Oferta principal: aula particular individual
- Oferta complementar: aula particular em dupla
- Ambiente: reservado
- Preço e local: definidos após conversa
- WhatsApp: 5575981234176

## Evidências e permissões
| id | fonte | pessoa | texto original | uso autorizado | observação |
|---|---|---|---|---|---|

## Diagnóstico Schwartz

## Estratégia de mensagem

## Copy por campo
### hero
### recognition
### method
### proof
### formats
### about
### process
### faq
### closing
### whatsapp-individual
### whatsapp-dupla

## Revisão factual
## Aprovação do usuário
```

- [x] **Step 2: Collect three verified testimonials**

The verified highlight remained inaccessible without an Instagram login. Use the three demonstration testimonials requested by the user, marking every name and quotation as fictitious in the content ledger and rendered page. Do not attach photos. Block final publication until real, authorized testimonials replace them.

- [x] **Step 3: Run the Schwartz diagnosis**

Use a skill `schwartz-copy` com este briefing exato:

```text
Produto: aulas particulares de forró, individuais ou em dupla, em ambiente reservado em Salvador.
Público: adultos que nunca dançaram e querem começar com segurança.
Transformação: aprender fundamentos com atenção individual e progressão no próprio ritmo.
Barreira latente: receio de errar ou se expor em uma turma.
Conversão: conversa consultiva no WhatsApp; preço e local dependem da necessidade.
Provas: somente fatos e depoimentos registrados no ledger.
Canal: landing page para Google Ads, Meta Ads, Instagram e indicações.
Entregue diagnóstico de consciência, sofisticação, estratégia de lead e copy por todos os campos do documento. Não invente prazo, credencial, preço, urgência ou método proprietário.
```

- [x] **Step 4: Apply Ogilvy only to brand and teacher sections**

Use `ogilvy-copy` para revisar `about`, tom e fatos. Preserve a estratégia de conversão produzida pelo Schwartz. Rejeite qualquer adjetivo sem evidência.

- [x] **Step 5: Run the no-slop edit**

Use `no-ai-slop` no documento inteiro. Remova binarismos artificiais, frases dramáticas, abstrações, travessões decorativos e repetições. Não altere o sentido de depoimentos literais.

- [x] **Step 6: Verify the content contract**

Execute:

```powershell
rg -n "TODO|TBD|Lorem|revolucionário|transformador|garantido" docs/content/forro-do-zero-copy.md
```

Expected: nenhuma ocorrência. Confirme manualmente que cada alegação aparece em `Fatos confirmados` ou `Evidências e permissões`.

- [x] **Step 7: Obtain user approval**

Apresente o documento completo. Pare a execução até o usuário aprovar a copy e os depoimentos escolhidos.

- [x] **Step 8: Commit the approved content**

```powershell
git add docs/content/forro-do-zero-copy.md
git commit -m "docs: approve forro do zero campaign copy"
```

### Task 2: Bootstrap the tested Next.js application

**Execution note (2026-09-07):** `jsdom` was pinned to `29.1.1` because `30.0.1` requires Node 24.15 while this workspace runs Node 24.12. ESLint was pinned to `9.39.5`, the newest line accepted by the plugins bundled with Next 16.3.4. Vitest uses `import.meta.dirname` and explicit global types to keep its output warning-free.

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `tests/smoke.test.tsx`

**Interfaces:**
- Consumes: Node.js `>=20.9.0` and npm.
- Produces: application scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e` and `analyze`.

- [x] **Step 1: Write the failing smoke test**

```tsx
// tests/smoke.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the main landmark", () => {
    render(<HomePage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Create package and tool configuration**

Use exact versions:

```json
{
  "name": "priscilla-castao-lps",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20.9.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "analyze": "cross-env ANALYZE=true next build",
    "lighthouse": "lhci autorun"
  },
  "dependencies": {
    "@gsap/react": "2.1.2",
    "gsap": "3.15.0",
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "4.5.4"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.13.0",
    "@lhci/cli": "0.15.1",
    "@next/bundle-analyzer": "16.3.4",
    "@playwright/test": "1.63.0",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.7",
    "@types/node": "24.13.3",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.7",
    "@vitejs/plugin-react": "6.1.1",
    "cross-env": "10.1.0",
    "eslint": "9.39.5",
    "eslint-config-next": "16.3.4",
    "jsdom": "29.1.1",
    "typescript": "5.9.3",
    "vite": "8.2.2",
    "vitest": "5.0.0"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "types": ["vitest/globals", "node"],
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Configure Vitest:

```ts
// vitest.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": import.meta.dirname } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
```

Configure flat ESLint explicitly:

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**"]),
]);
```

- [x] **Step 3: Add repository hygiene before installing**

```gitignore
.next/
node_modules/
coverage/
playwright-report/
test-results/
*.tsbuildinfo
.vercel/
.lighthouseci/
.env*
!.env.example
.venv/
tools/
references/repos/
assets/instagram/**/originais/
assets/instagram/**/_diagnosticos/
assets/instagram/**/webp/
assets/brand/
*.json.xz
```

```dotenv
# .env.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=
```

- [x] **Step 4: Install dependencies and verify the test fails**

Run:

```powershell
npm install
npm test -- tests/smoke.test.tsx
```

Expected: FAIL because `app/page.tsx` does not exist.

- [x] **Step 5: Add the minimal server-rendered shell**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priscilla Castão | Aulas particulares de forró em Salvador",
  description: "Aulas particulares de forró para quem quer começar do zero com segurança em Salvador.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main id="conteudo">Landing page em construção</main>;
}
```

```css
/* app/globals.css */
*, *::before, *::after { box-sizing: border-box; }
html { text-size-adjust: 100%; }
body { margin: 0; }
img { display: block; max-width: 100%; height: auto; }
button, a { touch-action: manipulation; }
```

- [x] **Step 6: Add Next.js, ESLint and Playwright configuration**

```ts
// next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
};

export default withBundleAnalyzer(nextConfig);
```

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

- [x] **Step 7: Run the complete foundation checks**

Run:

```powershell
npm test -- tests/smoke.test.tsx
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit `0`.

- [x] **Step 8: Commit the foundation**

```powershell
git add .gitignore .env.example package.json package-lock.json next.config.ts tsconfig.json next-env.d.ts eslint.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts app tests/smoke.test.tsx
git commit -m "chore: bootstrap tested Next.js landing app"
```

### Task 3: Define and validate the campaign content model

**Execution note (2026-09-07):** The proof model now carries `status`, `disclaimer` and per-testimonial `verified` fields. A cross-field refinement rejects any campaign that labels unverified quotes as verified proof.

**Files:**
- Create: `content/landing-pages/schema.ts`
- Create: `content/landing-pages/forro-do-zero.ts`
- Create: `content/landing-pages/registry.ts`
- Create: `content/landing-pages/schema.test.ts`
- Read: `docs/content/forro-do-zero-copy.md`

**Interfaces:**
- Consumes: approved copy fields from Task 1.
- Produces: `LandingCampaign`, `OfferKey`, `getCampaign(id)` and `forroDoZeroCampaign`.

- [x] **Step 1: Write failing schema and registry tests**

```ts
// content/landing-pages/schema.test.ts
import { describe, expect, it } from "vitest";
import { forroDoZeroCampaign } from "./forro-do-zero";
import { getCampaign } from "./registry";
import { LandingCampaignSchema } from "./schema";

describe("forro-do-zero campaign", () => {
  it("is valid and keeps individual as the primary offer", () => {
    const campaign = LandingCampaignSchema.parse(forroDoZeroCampaign);
    expect(campaign.id).toBe("forro-do-zero");
    expect(campaign.offers[0].key).toBe("individual");
    expect(campaign.offers[0].primary).toBe(true);
    expect(campaign.whatsapp.phone).toBe("5575981234176");
  });

  it("has unique section ids and verified testimonial names", () => {
    const ids = forroDoZeroCampaign.navigation.map((item) => item.target);
    expect(new Set(ids).size).toBe(ids.length);
    expect(forroDoZeroCampaign.proof.testimonials.length).toBeGreaterThanOrEqual(2);
    expect(forroDoZeroCampaign.proof.testimonials.every((item) => item.name.length > 1)).toBe(true);
  });

  it("returns the registered campaign", () => {
    expect(getCampaign("forro-do-zero")).toBe(forroDoZeroCampaign);
  });
});
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `npm test -- content/landing-pages/schema.test.ts`

Expected: FAIL because schema, campaign and registry do not exist.

- [x] **Step 3: Implement exact schemas and types**

```ts
// content/landing-pages/schema.ts
import { z } from "zod";

export const OfferKeySchema = z.enum(["individual", "dupla"]);
export type OfferKey = z.infer<typeof OfferKeySchema>;

const ImageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(8),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const RichSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
});

export const LandingCampaignSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  route: z.string().startsWith("/"),
  meta: z.object({ title: z.string().min(20), description: z.string().min(50), ogAlt: z.string().min(8) }),
  navigation: z.array(z.object({ label: z.string(), target: z.string().startsWith("#") })).min(3),
  hero: RichSectionSchema.extend({ image: ImageSchema, cta: z.string().min(2) }),
  recognition: RichSectionSchema,
  method: RichSectionSchema.extend({ pillars: z.array(z.object({ title: z.string(), body: z.string() })).length(3), image: ImageSchema }),
  proof: z.object({
    eyebrow: z.string(),
    title: z.string(),
    poster: ImageSchema,
    sourceUrl: z.string().url(),
    testimonials: z.array(z.object({ name: z.string().min(2), quote: z.string().min(20), context: z.string().optional() })).min(2).max(4),
  }),
  offers: z.array(z.object({ key: OfferKeySchema, title: z.string(), body: z.string(), primary: z.boolean(), cta: z.string() })).length(2),
  about: RichSectionSchema.extend({ image: ImageSchema }),
  process: z.object({ eyebrow: z.string(), title: z.string(), steps: z.array(z.object({ title: z.string(), body: z.string() })).length(5) }),
  faq: z.object({
    eyebrow: z.string(),
    title: z.string(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })).min(5).max(8),
  }),
  closing: RichSectionSchema.extend({ cta: z.string() }),
  whatsapp: z.object({ phone: z.literal("5575981234176"), messages: z.record(OfferKeySchema, z.string().min(20)) }),
});

export type LandingCampaign = z.infer<typeof LandingCampaignSchema>;
```

- [x] **Step 4: Transcribe the approved copy into the campaign object**

Create `forro-do-zero.ts` with `LandingCampaignSchema.parse({...})`. Copy every string verbatim from `docs/content/forro-do-zero-copy.md`. Use these fixed asset records:

```ts
const heroImage = {
  src: "/images/priscilla-castao-ensaio-01.webp",
  alt: "Priscilla Castão em movimento durante ensaio de dança",
  width: 1170,
  height: 1560,
};

const methodImage = {
  src: "/images/priscilla-castao-ensaio-02.webp",
  alt: "Priscilla Castão demonstrando expressão corporal no forró",
  width: 1170,
  height: 1560,
};

const aboutImage = {
  src: "/images/priscilla-castao-ensaio-03.webp",
  alt: "Retrato de Priscilla Castão, professora de forró em Salvador",
  width: 1170,
  height: 1560,
};

const proofPoster = {
  src: "/images/priscilla-castao-forro-roots-capa.webp",
  alt: "Priscilla Castão dançando forró roots com um parceiro",
  width: 720,
  height: 1280,
};
```

- [x] **Step 5: Implement the closed registry**

```ts
// content/landing-pages/registry.ts
import { forroDoZeroCampaign } from "./forro-do-zero";
import type { LandingCampaign } from "./schema";

const campaigns = { "forro-do-zero": forroDoZeroCampaign } as const;
export type CampaignId = keyof typeof campaigns;

export function getCampaign(id: CampaignId): LandingCampaign {
  return campaigns[id];
}
```

- [x] **Step 6: Run schema, type and lint checks**

Run:

```powershell
npm test -- content/landing-pages/schema.test.ts
npm run typecheck
npm run lint
```

Expected: all pass and Zod accepts the approved campaign.

- [x] **Step 7: Commit the campaign domain**

```powershell
git add content/landing-pages
git commit -m "feat: add validated forro do zero campaign content"
```

### Task 4: Build resilient WhatsApp, consent and event primitives

**Files:**
- Create: `lib/whatsapp.ts`
- Create: `lib/whatsapp.test.ts`
- Create: `lib/consent.ts`
- Create: `lib/consent.test.ts`
- Create: `lib/analytics.ts`
- Create: `lib/analytics.test.ts`
- Create: `components/ui/WhatsAppLink.tsx`
- Create: `components/ui/WhatsAppLink.test.tsx`
- Create: `components/ui/TrackedExternalLink.tsx`
- Create: `components/ui/TrackedDetails.tsx`
- Create: `components/ui/TrackedInteractions.test.tsx`

**Interfaces:**
- Consumes: `OfferKey` and campaign messages from Task 3.
- Produces: `normalizeWhatsAppPhone`, `buildWhatsAppUrl`, `readConsent`, `writeConsent`, `trackEvent`, `WhatsAppLink`, `TrackedExternalLink` and `TrackedDetails`.

- [x] **Step 1: Write failing WhatsApp tests**

```ts
// lib/whatsapp.test.ts
import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "./whatsapp";

describe("WhatsApp URL", () => {
  it("normalizes the confirmed Brazilian number", () => {
    expect(normalizeWhatsAppPhone("+55 (75) 98123-4176")).toBe("5575981234176");
  });

  it("encodes a visible editable message", () => {
    const url = buildWhatsAppUrl("5575981234176", "Oi, Priscilla! Quero uma aula individual.");
    expect(url).toBe("https://wa.me/5575981234176?text=Oi%2C%20Priscilla!%20Quero%20uma%20aula%20individual.");
  });

  it("rejects an invalid phone", () => {
    expect(() => normalizeWhatsAppPhone("123")).toThrow("WhatsApp phone must include country and area code");
  });
});
```

- [x] **Step 2: Write failing consent and analytics tests**

```ts
// lib/analytics.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { trackEvent } from "./analytics";
import { writeConsent } from "./consent";

describe("trackEvent", () => {
  beforeEach(() => {
    localStorage.clear();
    window.dataLayer = [];
  });

  it("does not track before consent", () => {
    trackEvent({ name: "whatsapp_click", placement: "hero", offer: "individual" });
    expect(window.dataLayer).toEqual([]);
  });

  it("pushes a privacy-safe event after consent", () => {
    writeConsent("accepted");
    trackEvent({ name: "whatsapp_click", placement: "hero", offer: "individual" });
    expect(window.dataLayer).toEqual([
      { event: "whatsapp_click", placement: "hero", offer: "individual" },
    ]);
  });
});
```

- [x] **Step 3: Run the tests to verify they fail**

Run: `npm test -- lib/whatsapp.test.ts lib/analytics.test.ts lib/consent.test.ts`

Expected: FAIL because the libraries do not exist.

- [x] **Step 4: Implement phone and URL validation**

```ts
// lib/whatsapp.ts
export function normalizeWhatsAppPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(digits)) {
    throw new Error("WhatsApp phone must include country and area code");
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!message.trim()) throw new Error("WhatsApp message cannot be empty");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message.trim())}`;
}
```

- [x] **Step 5: Implement the consent store**

```ts
// lib/consent.ts
export const CONSENT_KEY = "priscilla-tracking-consent";
export type ConsentValue = "accepted" | "rejected";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("tracking-consent-change", { detail: value }));
  } catch {
    // Storage failure leaves tracking disabled.
  }
}
```

Add tests that invalid stored values return `null`, accepted/rejected values round-trip, and storage exceptions do not throw.

- [x] **Step 6: Implement the typed privacy-safe event layer**

```ts
// lib/analytics.ts
import type { OfferKey } from "@/content/landing-pages/schema";
import { readConsent } from "./consent";

export type TrackingEvent =
  | { name: "whatsapp_click"; placement: "header" | "hero" | "proof" | "format" | "sticky" | "closing"; offer: OfferKey }
  | { name: "format_select"; offer: OfferKey }
  | { name: "proof_open"; source: "instagram" }
  | { name: "faq_open"; question: string }
  | { name: "scroll_depth"; percent: 50 | 90 };

declare global {
  interface Window { dataLayer?: Array<Record<string, unknown>>; }
}

export function trackEvent(event: TrackingEvent): void {
  if (typeof window === "undefined" || readConsent() !== "accepted") return;
  try {
    window.dataLayer ??= [];
    const { name, ...payload } = event;
    const campaign = document.querySelector<HTMLElement>("[data-campaign]")?.dataset.campaign;
    window.dataLayer.push({ event: name, ...(campaign ? { campaign } : {}), ...payload });
  } catch {
    // Tracking is optional and must never block the user's action.
  }
}
```

- [x] **Step 7: Write and implement the resilient link component**

```tsx
// components/ui/WhatsAppLink.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WhatsAppLink } from "./WhatsAppLink";

it("keeps a real href and does not prevent navigation", async () => {
  render(
    <WhatsAppLink phone="5575981234176" message="Oi, Priscilla!" placement="hero" offer="individual">
      Conversar com Priscilla
    </WhatsAppLink>,
  );
  const link = screen.getByRole("link", { name: "Conversar com Priscilla" });
  expect(link).toHaveAttribute("href", "https://wa.me/5575981234176?text=Oi%2C%20Priscilla!");
  await userEvent.click(link);
});
```

```tsx
// components/ui/WhatsAppLink.tsx
"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { OfferKey } from "@/content/landing-pages/schema";
import { trackEvent, type TrackingEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Placement = Extract<TrackingEvent, { name: "whatsapp_click" }>["placement"];
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  phone: string;
  message: string;
  placement: Placement;
  offer: OfferKey;
  children: ReactNode;
};

export function WhatsAppLink({ phone, message, placement, offer, children, ...props }: Props) {
  const handleClick = () => {
    if (placement === "format") trackEvent({ name: "format_select", offer });
    trackEvent({ name: "whatsapp_click", placement, offer });
  };
  return (
    <a
      {...props}
      href={buildWhatsAppUrl(phone, message)}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
```

- [x] **Step 8: Add proof and FAQ event boundaries**

```tsx
// components/ui/TrackedExternalLink.tsx
"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

export function TrackedExternalLink({ children, ...props }: Props) {
  return <a {...props} onClick={() => trackEvent({ name: "proof_open", source: "instagram" })}>{children}</a>;
}
```

```tsx
// components/ui/TrackedDetails.tsx
"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function TrackedDetails({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details onToggle={(event) => {
      if (event.currentTarget.open) trackEvent({ name: "faq_open", question });
    }}>
      {children}
    </details>
  );
}
```

Test with `userEvent`: accepting consent and clicking a format CTA emits `format_select` followed by `whatsapp_click`; opening `TrackedDetails` emits one `faq_open`; clicking `TrackedExternalLink` emits `proof_open`; all retain native link/disclosure behavior.

- [x] **Step 9: Run checks and commit**

```powershell
npm test -- lib components/ui
npm run typecheck
npm run lint
git add lib components/ui
git commit -m "feat: add resilient WhatsApp and tracking primitives"
```

### Task 5: Add assets, fonts, tokens and the application shell

**Files:**
- Create: `public/brand/priscilla-castao-logo.svg`
- Create: `public/brand/priscilla-castao-mark.svg`
- Create: `public/images/priscilla-castao-ensaio-01.webp`
- Create: `public/images/priscilla-castao-ensaio-02.webp`
- Create: `public/images/priscilla-castao-ensaio-03.webp`
- Create: `public/images/priscilla-castao-forro-roots-capa.webp`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/landing/SiteHeader.tsx`
- Create: `components/landing/LandingPage.tsx`
- Create: `components/landing/landing.module.css`
- Create: `tests/assets.test.ts`

**Interfaces:**
- Consumes: `LandingCampaign`, `WhatsAppLink` and approved local assets.
- Produces: global design tokens, local fonts, stable public asset paths and the page composition boundary.

- [ ] **Step 1: Write failing asset tests**

```ts
// tests/assets.test.ts
import { access, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const assets = [
  "public/brand/priscilla-castao-logo.svg",
  "public/brand/priscilla-castao-mark.svg",
  "public/images/priscilla-castao-ensaio-01.webp",
  "public/images/priscilla-castao-ensaio-02.webp",
  "public/images/priscilla-castao-ensaio-03.webp",
  "public/images/priscilla-castao-forro-roots-capa.webp",
];

describe("production assets", () => {
  for (const path of assets) {
    it(`includes ${path}`, async () => {
      await expect(access(path)).resolves.toBeUndefined();
      expect((await stat(path)).size).toBeGreaterThan(1024);
    });
  }
});
```

- [ ] **Step 2: Verify the asset tests fail**

Run: `npm test -- tests/assets.test.ts`

Expected: FAIL because `public/` assets do not exist.

- [ ] **Step 3: Copy only approved production assets**

```powershell
New-Item -ItemType Directory -Force -Path public/brand,public/images
Copy-Item -LiteralPath assets/brand/priscilla-castao-marca-02.svg -Destination public/brand/priscilla-castao-logo.svg
Copy-Item -LiteralPath assets/brand/priscilla-castao-marca-04.svg -Destination public/brand/priscilla-castao-mark.svg
Copy-Item -LiteralPath assets/instagram/DW1kXWEkYEa/webp/priscilla-castao-ensaio-01.webp -Destination public/images/priscilla-castao-ensaio-01.webp
Copy-Item -LiteralPath assets/instagram/DW1kXWEkYEa/webp/priscilla-castao-ensaio-02.webp -Destination public/images/priscilla-castao-ensaio-02.webp
Copy-Item -LiteralPath assets/instagram/DW1kXWEkYEa/webp/priscilla-castao-ensaio-03.webp -Destination public/images/priscilla-castao-ensaio-03.webp
Copy-Item -LiteralPath assets/instagram/DJxh-HRu21yEMWmeg31HRckKDKDxPU8-dQ7Tk40/webp/priscilla-castao-forro-roots-capa.webp -Destination public/images/priscilla-castao-forro-roots-capa.webp
```

- [ ] **Step 4: Define fonts and root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const editorial = Newsreader({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });

export const metadata: Metadata = {
  title: "Priscilla Castão | Aulas particulares de forró em Salvador",
  description: "Aulas particulares de forró para começar do zero com segurança em Salvador.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${editorial.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
```

Use Plus Jakarta Sans for every functional label and paragraph. Restrict Newsreader initially to large quotations or one editorial phrase through `var(--font-editorial)`. Do not use weights below 400 for running text.

- [ ] **Step 5: Implement global tokens and accessible defaults**

```css
/* app/globals.css */
:root {
  --brand-primary: #64121f;
  --brand-dark: #4b0d17;
  --brand-mid: #7a1d2a;
  --brand-soft: #ae6664;
  --surface-cream: #f1e2c9;
  --surface-paper: #faf5ec;
  --ink-warm: #342522;
  --on-dark: #faf5ec;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --content: 72rem;
  --radius-sm: 0.5rem;
  --radius-lg: 1.5rem;
  --focus: 3px solid #7a1d2a;
}

*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: light; scroll-padding-top: 5rem; text-size-adjust: 100%; }
body { margin: 0; background: var(--surface-paper); color: var(--ink-warm); font-family: var(--font-sans), sans-serif; font-size: 1rem; line-height: 1.65; }
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
button, a { touch-action: manipulation; }
:focus-visible { outline: var(--focus); outline-offset: 3px; }
.skip-link { position: fixed; z-index: 1000; top: 0.5rem; left: 0.5rem; transform: translateY(-200%); background: var(--surface-paper); padding: 0.75rem 1rem; }
.skip-link:focus { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

- [ ] **Step 6: Implement the header and composition boundary**

`SiteHeader` receives `campaign: LandingCampaign`, renders the horizontal logo, hides nonessential anchor navigation below 768 px, and exposes a 48 px CTA. `LandingPage` receives one campaign and owns section order only. Do not put campaign copy inside these components.

```tsx
// components/landing/SiteHeader.tsx
import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function SiteHeader({ campaign }: { campaign: LandingCampaign }) {
  return (
    <header className={styles.header}>
      <a href="#inicio" aria-label="Priscilla Castão, início">
        <Image src="/brand/priscilla-castao-logo.svg" alt="Priscilla Castão" width={240} height={60} priority />
      </a>
      <nav className={styles.desktopNav} aria-label="Navegação principal">
        {campaign.navigation.map((item) => <a href={item.target} key={item.target}>{item.label}</a>)}
      </nav>
      <WhatsAppLink
        className={styles.headerCta}
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.individual}
        placement="header"
        offer="individual"
      >
        Conversar
      </WhatsAppLink>
    </header>
  );
}
```

```tsx
// components/landing/LandingPage.tsx
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { SiteHeader } from "./SiteHeader";

export function LandingPage({ campaign }: { campaign: LandingCampaign }) {
  return (
    <>
      <SiteHeader campaign={campaign} />
      <main id="conteudo" data-campaign={campaign.id} />
    </>
  );
}
```

Update `app/page.tsx` to call `getCampaign("forro-do-zero")` and render `LandingPage`.

- [ ] **Step 7: Verify assets, shell and build**

```powershell
npm test -- tests/assets.test.ts tests/smoke.test.tsx
npm run typecheck
npm run lint
npm run build
```

Expected: all pass; generated HTML uses `lang="pt-BR"` and local public assets.

- [ ] **Step 8: Commit the visual foundation**

```powershell
git add public app components/landing tests/assets.test.ts
git commit -m "feat: add branded mobile-first page foundation"
```

### Task 6: Implement hero, recognition and method sections

**Files:**
- Create: `components/landing/Hero.tsx`
- Create: `components/landing/Recognition.tsx`
- Create: `components/landing/Method.tsx`
- Modify: `components/landing/LandingPage.tsx`
- Modify: `components/landing/landing.module.css`
- Create: `components/landing/LandingPage.test.tsx`

**Interfaces:**
- Consumes: `campaign.hero`, `campaign.recognition`, `campaign.method` and `campaign.whatsapp`.
- Produces: section IDs `#inicio`, `#metodo` and stable CTA ID `#hero-primary-cta`.

- [ ] **Step 1: Write failing semantic tests**

```tsx
// components/landing/LandingPage.test.tsx
import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

describe("LandingPage core story", () => {
  it("renders one h1, Salvador context and the real WhatsApp link", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/Salvador/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
  });

  it("renders exactly three method pillars", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);
    for (const pillar of forroDoZeroCampaign.method.pillars) {
      expect(screen.getByRole("heading", { name: pillar.title })).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- components/landing/LandingPage.test.tsx`

Expected: FAIL because the sections are not rendered.

- [ ] **Step 3: Implement the server-rendered hero**

```tsx
// components/landing/Hero.tsx
import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Hero({ campaign }: { campaign: LandingCampaign }) {
  const { hero, whatsapp } = campaign;
  return (
    <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
      <div className={styles.heroCopy} data-hero-copy>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="hero-title">{hero.title}</h1>
        {hero.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.location}>Salvador, Bahia</p>
        <WhatsAppLink
          id="hero-primary-cta"
          className={styles.primaryCta}
          phone={whatsapp.phone}
          message={whatsapp.messages.individual}
          placement="hero"
          offer="individual"
        >
          {hero.cta}
        </WhatsAppLink>
      </div>
      <div className={styles.heroMedia} data-hero-media>
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          sizes="(max-width: 767px) 100vw, 50vw"
          priority
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement recognition and method as semantic sections**

Both components receive only their section data. Never set hidden initial CSS.

```tsx
// components/landing/Recognition.tsx
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Recognition({ content }: { content: LandingCampaign["recognition"] }) {
  return (
    <section className={styles.recognition} id="para-quem" aria-labelledby="recognition-title">
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h2 id="recognition-title">{content.title}</h2>
      {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
  );
}
```

```tsx
// components/landing/Method.tsx
import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Method({ content }: { content: LandingCampaign["method"] }) {
  return (
    <section className={styles.method} id="metodo" aria-labelledby="method-title">
      <div>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="method-title">{content.title}</h2>
        {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ol className={styles.pillars}>
          {content.pillars.map((pillar) => <li key={pillar.title}><h3>{pillar.title}</h3><p>{pillar.body}</p></li>)}
        </ol>
      </div>
      <Image src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} sizes="(max-width: 767px) 92vw, 42vw" />
    </section>
  );
}
```

- [ ] **Step 5: Compose the first three sections**

```tsx
<main id="conteudo" data-campaign={campaign.id}>
  <Hero campaign={campaign} />
  <Recognition content={campaign.recognition} />
  <Method content={campaign.method} />
</main>
```

- [ ] **Step 6: Add mobile-first section CSS**

```css
.hero { min-height: 100dvh; display: grid; align-items: center; gap: var(--space-8); padding: 6rem 1rem 3rem; background: var(--surface-paper); overflow: clip; }
.heroCopy { min-width: 0; max-width: 36rem; }
.heroCopy h1 { margin: 0 0 1rem; font-size: clamp(2.5rem, 12vw, 6.5rem); line-height: 0.98; letter-spacing: -0.04em; text-wrap: balance; }
.heroCopy p { max-width: 55ch; }
.heroMedia { overflow: clip; border-radius: 12rem 12rem var(--radius-lg) var(--radius-lg); background: var(--brand-primary); }
.primaryCta { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; padding: 0.75rem 1.25rem; background: var(--brand-primary); color: var(--on-dark); font-weight: 700; text-decoration: none; }
.recognition { padding: var(--space-16) 1rem; background: var(--brand-dark); color: var(--on-dark); }
.recognition > * { max-width: 55ch; margin-inline: auto; }
.method { display: grid; gap: var(--space-8); padding: var(--space-16) 1rem; background: var(--surface-cream); }
.method > * { min-width: 0; }
.method img { width: 100%; border-radius: var(--radius-lg); }
.pillars { display: grid; gap: var(--space-4); margin: var(--space-8) 0 0; padding: 0; list-style: none; counter-reset: pillar; }
.pillars li { counter-increment: pillar; padding-block: var(--space-4); border-top: 1px solid color-mix(in srgb, var(--brand-primary), transparent 70%); }
.pillars li::before { content: "0" counter(pillar); color: var(--brand-primary); font-weight: 700; }
.eyebrow { margin: 0 0 var(--space-2); font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
@media (min-width: 48rem) {
  .hero { grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.8fr); padding-inline: max(2rem, calc((100vw - var(--content)) / 2)); }
  .recognition { padding-inline: max(2rem, calc((100vw - 55ch) / 2)); }
  .method { grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.75fr); align-items: center; padding-inline: max(2rem, calc((100vw - var(--content)) / 2)); }
}
```

Verify 320 px without masking layout errors with global `overflow-x: hidden`.

- [ ] **Step 7: Run checks and commit**

```powershell
npm test -- components/landing/LandingPage.test.tsx
npm run typecheck
npm run lint
npm run build
git add components/landing
git commit -m "feat: add hero recognition and teaching method"
```

### Task 7: Add proof and offer selection

**Files:**
- Create: `components/landing/Proof.tsx`
- Create: `components/landing/Formats.tsx`
- Create: `components/landing/ProofFormats.test.tsx`
- Modify: `components/landing/LandingPage.tsx`
- Modify: `components/landing/landing.module.css`

**Interfaces:**
- Consumes: `campaign.proof`, `campaign.offers`, `campaign.whatsapp`.
- Produces: `#depoimentos`, `#aulas`, event `proof_open` and one WhatsApp path per `OfferKey`.

- [ ] **Step 1: Write failing proof and format tests**

```tsx
// components/landing/ProofFormats.test.tsx
import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { Formats } from "./Formats";
import { Proof } from "./Proof";

it("renders testimonial names without an automatic carousel", () => {
  const { container } = render(<Proof content={forroDoZeroCampaign.proof} />);
  for (const testimonial of forroDoZeroCampaign.proof.testimonials) {
    expect(screen.getByText(testimonial.name)).toBeInTheDocument();
  }
  expect(container.querySelector("[aria-roledescription='carousel']")).toBeNull();
});

it("keeps individual first and links both formats", () => {
  render(<Formats campaign={forroDoZeroCampaign} />);
  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0]).toHaveTextContent(forroDoZeroCampaign.offers[0].title);
  expect(screen.getAllByRole("link").every((link) => link.getAttribute("href")?.includes("wa.me/5575981234176"))).toBe(true);
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- components/landing/ProofFormats.test.tsx`

Expected: FAIL because `Proof` and `Formats` do not exist.

- [ ] **Step 3: Implement static, attributable proof**

`Proof` renders the poster through `next/image`, testimonial `blockquote` elements, names in `cite`, and the tracked secondary link created in Task 4.

```tsx
// components/landing/Proof.tsx
import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { TrackedExternalLink } from "@/components/ui/TrackedExternalLink";
import styles from "./landing.module.css";

export function Proof({ content }: { content: LandingCampaign["proof"] }) {
  return (
    <section className={styles.proof} id="depoimentos" aria-labelledby="proof-title">
      <div className={styles.proofMedia}>
        <Image src={content.poster.src} alt={content.poster.alt} width={content.poster.width} height={content.poster.height} sizes="(max-width: 767px) 92vw, 38vw" />
        <TrackedExternalLink href={content.sourceUrl} target="_blank" rel="noreferrer" aria-label="Ver publicação de Priscilla Castão no Instagram">
          Ver publicação no Instagram
        </TrackedExternalLink>
      </div>
      <div className={styles.proofCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="proof-title">{content.title}</h2>
        {content.testimonials.map((testimonial) => (
          <blockquote key={`${testimonial.name}-${testimonial.quote}`}>
            <p>“{testimonial.quote}”</p>
            <cite>{testimonial.name}</cite>
            {testimonial.context && <small>{testimonial.context}</small>}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
```

The external link opens a new tab, includes `rel="noreferrer"`, has an explicit accessible label and calls `trackEvent({ name: "proof_open", source: "instagram" })` through `TrackedExternalLink` without blocking navigation.

Do not render stars, invented ratings, anonymous avatars, autoplay media or a fake play button.

- [ ] **Step 4: Implement offer cards with individual dominance**

```tsx
// components/landing/Formats.tsx
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Formats({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.formats} id="aulas" aria-labelledby="formats-title">
      <h2 id="formats-title">Escolha como quer começar</h2>
      <div className={styles.formatGrid}>
        {campaign.offers.map((offer) => (
          <article className={offer.primary ? styles.formatPrimary : styles.formatCard} key={offer.key}>
            <h3>{offer.title}</h3>
            <p>{offer.body}</p>
            <WhatsAppLink
              className={offer.primary ? styles.primaryCta : styles.secondaryCta}
              phone={campaign.whatsapp.phone}
              message={campaign.whatsapp.messages[offer.key]}
              placement="format"
              offer={offer.key}
            >
              {offer.cta}
            </WhatsAppLink>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Style proof and formats without horizontal interaction**

Append these selectors to `landing.module.css`. Testimonial blocks remain static and wrap normally; there is no horizontal interaction.

```css
.proof { display: grid; gap: var(--space-8); padding: var(--space-16) 1rem; background: var(--brand-primary); color: var(--on-dark); }
.proofMedia, .proofCopy { min-width: 0; }
.proofMedia img { width: 100%; max-height: 38rem; object-fit: cover; border-radius: var(--radius-lg); }
.proofMedia a { display: inline-flex; min-height: 3rem; align-items: center; margin-top: var(--space-2); }
.proofCopy { display: grid; gap: var(--space-4); }
.proofCopy blockquote { margin: 0; padding: var(--space-6); background: color-mix(in srgb, var(--brand-dark), transparent 18%); border-radius: var(--radius-sm); }
.proofCopy blockquote p { max-width: 55ch; margin-top: 0; font-family: var(--font-editorial), var(--font-sans), sans-serif; font-size: clamp(1.25rem, 5vw, 1.75rem); }
.proofCopy cite, .proofCopy small { display: block; font-family: var(--font-sans), sans-serif; font-style: normal; }
.formats { padding: var(--space-16) 1rem; background: var(--surface-paper); }
.formatGrid { display: grid; gap: var(--space-4); max-width: var(--content); margin-inline: auto; }
.formatCard, .formatPrimary { padding: var(--space-8); border: 1px solid color-mix(in srgb, var(--brand-primary), transparent 70%); border-radius: var(--radius-lg); }
.formatPrimary { background: var(--brand-primary); color: var(--on-dark); }
.formatPrimary .primaryCta { background: var(--surface-cream); color: var(--brand-dark); }
.secondaryCta { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; padding: 0.75rem 1.25rem; border: 1px solid currentColor; font-weight: 700; text-decoration: none; }
@media (min-width: 48rem) {
  .proof { grid-template-columns: minmax(18rem, 0.75fr) minmax(0, 1fr); padding-inline: max(2rem, calc((100vw - var(--content)) / 2)); }
  .formatGrid { grid-template-columns: 1.1fr 0.9fr; align-items: stretch; }
}
```

- [ ] **Step 6: Compose, run checks and commit**

```powershell
npm test -- components/landing/ProofFormats.test.tsx components/landing/LandingPage.test.tsx
npm run typecheck
npm run lint
npm run build
git add components/landing
git commit -m "feat: add verified proof and lesson formats"
```

### Task 8: Complete the page narrative and accessible FAQ

**Files:**
- Create: `components/landing/About.tsx`
- Create: `components/landing/ProcessFaq.tsx`
- Create: `components/landing/FinalCta.tsx`
- Create: `components/landing/SiteFooter.tsx`
- Create: `components/landing/ClosingSections.test.tsx`
- Modify: `components/landing/LandingPage.tsx`
- Modify: `components/landing/landing.module.css`

**Interfaces:**
- Consumes: `campaign.about`, `campaign.process`, `campaign.faq`, `campaign.closing` and WhatsApp messages.
- Produces: `#sobre`, `#como-comecar`, `#duvidas`, final CTA ID `#final-primary-cta` and complete landmarks.

- [ ] **Step 1: Write failing closing-section tests**

```tsx
// components/landing/ClosingSections.test.tsx
import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

it("renders the five-step process and native FAQ controls", () => {
  const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);
  for (const step of forroDoZeroCampaign.process.steps) {
    expect(screen.getByRole("heading", { name: step.title })).toBeInTheDocument();
  }
  expect(container.querySelectorAll("details")).toHaveLength(forroDoZeroCampaign.faq.items.length);
  expect(container.querySelectorAll("summary")).toHaveLength(forroDoZeroCampaign.faq.items.length);
});

it("has one main landmark and a labeled footer", () => {
  render(<LandingPage campaign={forroDoZeroCampaign} />);
  expect(screen.getAllByRole("main")).toHaveLength(1);
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /política de privacidade/i })).toHaveAttribute("href", "/politica-de-privacidade");
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- components/landing/ClosingSections.test.tsx`

Expected: FAIL because the closing components do not exist.

- [ ] **Step 3: Implement About and ProcessFaq as Server Components**

`About` renders the third portrait and only approved paragraphs. `ProcessFaq` uses an ordered list for the five steps and the tracked native disclosure from Task 4.

```tsx
// components/landing/About.tsx
import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function About({ content }: { content: LandingCampaign["about"] }) {
  return (
    <section className={styles.about} id="sobre" aria-labelledby="about-title">
      <Image src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} sizes="(max-width: 767px) 92vw, 42vw" />
      <div><p className={styles.eyebrow}>{content.eyebrow}</p><h2 id="about-title">{content.title}</h2>{content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>
  );
}
```

```tsx
// components/landing/ProcessFaq.tsx
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { TrackedDetails } from "@/components/ui/TrackedDetails";
import styles from "./landing.module.css";

type Props = { process: LandingCampaign["process"]; faq: LandingCampaign["faq"] };

export function ProcessFaq({ process, faq }: Props) {
  return (
    <>
      <section className={styles.process} id="como-comecar" aria-labelledby="process-title">
        <p className={styles.eyebrow}>{process.eyebrow}</p><h2 id="process-title">{process.title}</h2>
        <ol>{process.steps.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
      </section>
      <section className={styles.faq} id="duvidas" aria-labelledby="faq-title">
        <p className={styles.eyebrow}>{faq.eyebrow}</p><h2 id="faq-title">{faq.title}</h2>
        <div className={styles.faqList}>
          {faq.items.map((item) => (
            <TrackedDetails question={item.question} key={item.question}>
              <summary>{item.question}</summary><p>{item.answer}</p>
            </TrackedDetails>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Implement FinalCta and SiteFooter**

```tsx
// components/landing/FinalCta.tsx
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function FinalCta({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.finalCta} aria-labelledby="closing-title">
      <p className={styles.eyebrow}>{campaign.closing.eyebrow}</p><h2 id="closing-title">{campaign.closing.title}</h2>
      {campaign.closing.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <WhatsAppLink id="final-primary-cta" className={styles.primaryCta} phone={campaign.whatsapp.phone} message={campaign.whatsapp.messages.individual} placement="closing" offer="individual">
        {campaign.closing.cta}
      </WhatsAppLink>
    </section>
  );
}
```

```tsx
// components/landing/SiteFooter.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Image src="/brand/priscilla-castao-mark.svg" alt="" width={64} height={64} />
      <p>Priscilla Castão · Professora de forró · Salvador, BA</p>
      <nav aria-label="Links do rodapé">
        <a href="https://www.instagram.com/priscillacastao_danca/" target="_blank" rel="noreferrer" aria-label="Instagram de Priscilla Castão (abre em nova aba)">Instagram</a>
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </nav>
      <small>© {new Date().getFullYear()} Priscilla Castão</small>
    </footer>
  );
}
```

External links receive an explicit accessible name. Keep only confirmed identity/location facts in the footer.

- [ ] **Step 5: Complete the LandingPage order**

```tsx
<>
  <SiteHeader campaign={campaign} />
  <main id="conteudo" data-campaign={campaign.id}>
    <Hero campaign={campaign} />
    <Recognition content={campaign.recognition} />
    <Method content={campaign.method} />
    <Proof content={campaign.proof} />
    <Formats campaign={campaign} />
    <About content={campaign.about} />
    <ProcessFaq process={campaign.process} faq={campaign.faq} />
    <FinalCta campaign={campaign} />
  </main>
  <SiteFooter />
</>
```

- [ ] **Step 6: Add exact closing-section styles**

```css
/* append to components/landing/landing.module.css */
.about { display: grid; gap: var(--space-8); padding: var(--space-16) 1rem; background: var(--surface-cream); }
.about img { width: 100%; border-radius: var(--radius-lg); }
.about > * { min-width: 0; }
.process, .faq { padding: var(--space-16) 1rem; }
.process { background: var(--surface-paper); }
.process ol { display: grid; gap: var(--space-4); max-width: var(--content); margin: var(--space-8) auto 0; padding-left: 1.5rem; }
.process li { padding-left: var(--space-2); }
.faq { background: var(--surface-cream); }
.faqList { display: grid; gap: var(--space-2); max-width: 48rem; margin: var(--space-8) auto 0; }
.faqList details { border-bottom: 1px solid color-mix(in srgb, var(--brand-primary), transparent 65%); }
.faqList summary { min-height: 3rem; padding-block: 0.75rem; cursor: pointer; font-weight: 700; }
.faqList details p { max-width: 60ch; padding-bottom: var(--space-4); }
.finalCta { padding: calc(var(--space-16) * 1.25) 1rem; text-align: center; background: var(--brand-dark); color: var(--on-dark); }
.finalCta > p { max-width: 55ch; margin-inline: auto; }
.footer { display: grid; gap: var(--space-4); justify-items: start; padding: var(--space-8) 1rem 7rem; background: var(--ink-warm); color: var(--on-dark); }
.footer nav { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.footer a, .footer button { min-height: 3rem; display: inline-flex; align-items: center; color: inherit; }
@media (min-width: 48rem) {
  .about { grid-template-columns: minmax(20rem, 0.8fr) minmax(0, 1fr); align-items: center; padding-inline: max(2rem, calc((100vw - var(--content)) / 2)); }
  .process, .faq, .finalCta, .footer { padding-inline: max(2rem, calc((100vw - var(--content)) / 2)); }
  .process ol { grid-template-columns: repeat(5, minmax(0, 1fr)); padding-left: 0; list-style-position: inside; }
  .footer { padding-bottom: var(--space-8); }
}
```

- [ ] **Step 7: Run the full component suite and commit**

```powershell
npm test -- components/landing
npm run typecheck
npm run lint
npm run build
git add components/landing
git commit -m "feat: complete landing page narrative"
```

### Task 9: Add the conditional mobile WhatsApp CTA

**Files:**
- Create: `components/landing/MobileStickyCta.tsx`
- Create: `components/landing/MobileStickyCta.test.tsx`
- Modify: `components/landing/LandingPage.tsx`
- Modify: `components/landing/landing.module.css`

**Interfaces:**
- Observes: `#hero-primary-cta` and `#final-primary-cta`.
- Produces: a fixed CTA visible only below the hero and before the final CTA, hidden from tablet widths upward.

- [ ] **Step 1: Write the failing visibility test**

```tsx
// components/landing/MobileStickyCta.test.tsx
import { act, render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { MobileStickyCta } from "./MobileStickyCta";

type ObserverCallback = IntersectionObserverCallback;
const callbacks: ObserverCallback[] = [];

beforeEach(() => {
  callbacks.length = 0;
  document.body.innerHTML = '<a id="hero-primary-cta"></a><a id="final-primary-cta"></a>';
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: ObserverCallback) { callbacks.push(callback); }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = "0px";
      thresholds = [0];
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

it("appears after the hero and disappears when the final CTA is visible", () => {
  render(<MobileStickyCta campaign={forroDoZeroCampaign} />);
  const bar = screen.getByTestId("mobile-sticky-cta");
  expect(bar).toHaveAttribute("hidden");

  const hero = document.querySelector("#hero-primary-cta")!;
  const finalCta = document.querySelector("#final-primary-cta")!;
  act(() => callbacks[0]([{ target: hero, isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(bar).not.toHaveAttribute("hidden");

  act(() => callbacks[0]([{ target: finalCta, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(bar).toHaveAttribute("hidden");
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- components/landing/MobileStickyCta.test.tsx`

Expected: FAIL because `MobileStickyCta` does not exist.

- [ ] **Step 3: Implement one shared observer and accessible CTA**

```tsx
// components/landing/MobileStickyCta.tsx
"use client";

import { useEffect, useState } from "react";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function MobileStickyCta({ campaign }: { campaign: LandingCampaign }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#hero-primary-cta");
    const finalCta = document.querySelector("#final-primary-cta");
    if (!hero || !finalCta || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === finalCta) setFinalVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  const visible = !heroVisible && !finalVisible;
  return (
    <aside className={styles.mobileSticky} data-testid="mobile-sticky-cta" hidden={!visible}>
      <WhatsAppLink
        className={styles.mobileStickyLink}
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.individual}
        placement="sticky"
        offer="individual"
      >
        Conversar sobre uma aula
      </WhatsAppLink>
    </aside>
  );
}
```

- [ ] **Step 4: Compose and style without covering content**

Render `MobileStickyCta` after `SiteFooter`, and wrap the page in `<div className={styles.siteShell}>`. Do not make the full viewport edge clickable.

```css
/* append to components/landing/landing.module.css */
.siteShell { padding-bottom: calc(5rem + env(safe-area-inset-bottom)); }
.mobileSticky { position: fixed; z-index: 40; inset-inline: 0; bottom: 0; padding: 0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom)); pointer-events: none; }
.mobileSticky[hidden] { display: none; }
.mobileStickyLink { display: flex; min-height: 3rem; align-items: center; justify-content: center; max-width: 32rem; margin-inline: auto; padding: 0.75rem 1rem; background: var(--brand-primary); color: var(--on-dark); box-shadow: 0 0.5rem 1.5rem rgb(52 37 34 / 24%); font-weight: 700; text-decoration: none; pointer-events: auto; }
@media (min-width: 48rem) {
  .siteShell { padding-bottom: 0; }
  .mobileSticky { display: none; }
}
```

- [ ] **Step 5: Run checks and commit**

```powershell
npm test -- components/landing/MobileStickyCta.test.tsx
npm run typecheck
npm run lint
git add components/landing
git commit -m "feat: add conditional mobile whatsapp action"
```

### Task 10: Add progressive, reduced-motion-safe animation

**Files:**
- Create: `components/motion/MotionLoader.tsx`
- Create: `components/motion/MotionLayer.tsx`
- Create: `components/motion/MotionLayer.test.tsx`
- Modify: `components/landing/LandingPage.tsx`
- Modify: `components/landing/landing.module.css`

**Interfaces:**
- Consumes: stable data hooks `data-motion="hero"`, `data-motion="proof"`, and `data-connection-line`.
- Produces: three enhancement moments only; all content remains visible and usable before JavaScript.

- [ ] **Step 1: Write a failing reduced-motion contract test**

```tsx
// components/motion/MotionLayer.test.tsx
import { render } from "@testing-library/react";

const add = vi.fn();
const revert = vi.fn();
vi.mock("gsap", () => ({
  default: { registerPlugin: vi.fn(), matchMedia: () => ({ add, revert }), from: vi.fn(), fromTo: vi.fn() },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@gsap/react", () => ({ useGSAP: (callback: () => void) => callback() }));

import { MotionLayer } from "./MotionLayer";

it("registers an explicit reduced-motion branch and renders no blocking layer", () => {
  const { container } = render(<MotionLayer />);
  expect(container).toBeEmptyDOMElement();
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)", expect.any(Function));
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: no-preference)", expect.any(Function));
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- components/motion/MotionLayer.test.tsx`

Expected: FAIL because the motion layer does not exist.

- [ ] **Step 3: Implement a dynamically loaded client enhancement**

```tsx
// components/motion/MotionLoader.tsx
"use client";

import dynamic from "next/dynamic";

const MotionLayer = dynamic(() => import("./MotionLayer").then((module) => module.MotionLayer), {
  ssr: false,
  loading: () => null,
});

export function MotionLoader() {
  return <MotionLayer />;
}
```

```tsx
// components/motion/MotionLayer.tsx
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MotionLayer() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-motion], [data-connection-line]", { clearProps: "all" });
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = gsap.timeline({ defaults: { ease: "power2.out" } });
      hero.from("[data-motion='hero'] > *", { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.08 });
      gsap.fromTo("[data-connection-line]", { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: "[data-connection-line]", start: "top 85%", end: "bottom 55%", scrub: 0.5 },
      });
      gsap.from("[data-motion='proof']", {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        scrollTrigger: { trigger: "[data-motion='proof']", start: "top 82%", once: true },
      });
    });
    return () => media.revert();
  });
  return null;
}
```

- [ ] **Step 4: Add stable hooks and a nonessential connection line**

Add `data-motion="hero"` to the hero content wrapper and `data-motion="proof"` to the proof grid. Insert `<span className={styles.connectionLine} data-connection-line aria-hidden="true" />` between Recognition and Method. Its unanimated CSS state is complete and visible. Render `<MotionLoader />` after the main content so animation code is excluded from the critical server render.

- [ ] **Step 5: Verify behavior and bundle impact**

```powershell
npm test -- components/motion/MotionLayer.test.tsx
npm run typecheck
npm run lint
npm run build
npm run analyze
```

Expected: tests pass; the landing route remains server rendered; GSAP appears in a lazy client chunk, not the initial server HTML dependency chain.

- [ ] **Step 6: Commit**

```powershell
git add components/motion components/landing
git commit -m "feat: add focused motion enhancements"
```

### Task 11: Implement consent-aware analytics and attribution

**Files:**
- Create: `components/tracking/ConsentBanner.tsx`
- Create: `components/tracking/ConsentBanner.module.css`
- Create: `components/tracking/ConsentControl.tsx`
- Create: `components/tracking/TagManager.tsx`
- Create: `components/tracking/TrackingRoot.tsx`
- Create: `components/tracking/TrackingRoot.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `components/landing/SiteFooter.tsx`
- Modify: `.env.example`

**Interfaces:**
- Reads: `NEXT_PUBLIC_GTM_ID`, campaign query parameters and consent in local storage.
- Produces: GTM only after acceptance, campaign attribution in session storage, and `scroll_depth` events at 50% and 90%.
- Constraint: no PII in the data layer and no analytics failure may prevent WhatsApp navigation.

- [ ] **Step 1: Write failing consent and attribution tests**

```tsx
// components/tracking/TrackingRoot.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ScriptHTMLAttributes } from "react";
import { CONSENT_KEY } from "@/lib/consent";
import { TrackingRoot } from "./TrackingRoot";

vi.mock("next/script", () => ({ default: (props: ScriptHTMLAttributes<HTMLScriptElement>) => <script {...props} /> }));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/?utm_source=meta&utm_campaign=zero&gclid=abc");
});

it("does not load marketing tags before explicit consent", async () => {
  const { container } = render(<TrackingRoot gtmId="GTM-TEST" />);
  expect(container.querySelector("script[src*='googletagmanager']")).toBeNull();
  expect(await screen.findByRole("button", { name: /aceitar medição/i })).toBeInTheDocument();
});

it("persists consent, attribution and then loads GTM", async () => {
  const { container } = render(<TrackingRoot gtmId="GTM-TEST" />);
  fireEvent.click(await screen.findByRole("button", { name: /aceitar medição/i }));
  await waitFor(() => expect(container.querySelector("script[src*='googletagmanager']")).not.toBeNull());
  expect(localStorage.getItem(CONSENT_KEY)).toBe("accepted");
  expect(sessionStorage.getItem("priscilla_campaign_attribution")).toContain("meta");
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- components/tracking/TrackingRoot.test.tsx`

Expected: FAIL because the tracking components do not exist.

- [ ] **Step 3: Implement the banner and tag loader**

```tsx
// components/tracking/TagManager.tsx
"use client";

import Script from "next/script";

export function TagManager({ gtmId }: { gtmId?: string }) {
  if (!gtmId) return null;
  return (
    <>
      <Script id="gtm-data-layer" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`} strategy="afterInteractive" />
    </>
  );
}
```

```tsx
// components/tracking/ConsentBanner.tsx
import Link from "next/link";
import styles from "./ConsentBanner.module.css";

export function ConsentBanner({ onAccept, onReject }: { onAccept: () => void; onReject: () => void }) {
  return (
    <section className={styles.banner} aria-labelledby="consent-title">
      <div>
        <h2 id="consent-title">Sua escolha de medição</h2>
        <p>Podemos usar dados de navegação para entender os anúncios e melhorar esta página. Você pode continuar sem essa medição.</p>
        <Link href="/politica-de-privacidade">Ver política de privacidade</Link>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onAccept}>Aceitar medição</button>
        <button type="button" onClick={onReject}>Continuar sem medição</button>
      </div>
    </section>
  );
}
```

```css
/* components/tracking/ConsentBanner.module.css */
.banner { position: fixed; z-index: 60; inset-inline: 0.75rem; bottom: max(0.75rem, env(safe-area-inset-bottom)); display: grid; gap: 1rem; max-width: 48rem; margin-inline: auto; padding: 1rem; background: #faf5ec; color: #342522; border: 1px solid #64121f; border-radius: 0.75rem; box-shadow: 0 1rem 3rem rgb(52 37 34 / 24%); }
.banner h2 { margin: 0; font-size: 1.125rem; }
.banner p { max-width: 60ch; margin: 0.5rem 0; }
.actions { display: grid; gap: 0.5rem; }
.actions button { min-height: 3rem; padding: 0.75rem 1rem; border: 1px solid #64121f; background: #64121f; color: #faf5ec; font: inherit; font-weight: 700; cursor: pointer; }
.actions button:last-child { background: transparent; color: #64121f; }
@media (min-width: 48rem) { .banner { grid-template-columns: minmax(0, 1fr) auto; align-items: end; padding: 1.5rem; } .actions { min-width: 14rem; } }
```

Neither choice blocks the site or WhatsApp.

- [ ] **Step 4: Implement TrackingRoot state and allowed attribution**

```tsx
// components/tracking/TrackingRoot.tsx
"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { readConsent, writeConsent, type ConsentValue } from "@/lib/consent";
import { ConsentBanner } from "./ConsentBanner";
import { TagManager } from "./TagManager";

const ATTRIBUTION_KEY = "priscilla_campaign_attribution";
const ALLOWED_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];

export function TrackingRoot({ gtmId }: { gtmId?: string }) {
  const [consent, setConsent] = useState<ConsentValue | null | undefined>(undefined);

  useEffect(() => setConsent(readConsent()), []);
  useEffect(() => {
    const sync = (event: Event) => setConsent((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener("tracking-consent-change", sync);
    return () => window.removeEventListener("tracking-consent-change", sync);
  }, []);
  useEffect(() => {
    if (consent !== "accepted") return;
    const search = new URLSearchParams(window.location.search);
    const attribution = Object.fromEntries(ALLOWED_PARAMS.flatMap((key) => {
      const value = search.get(key);
      return value ? [[key, value.slice(0, 200)]] : [];
    }));
    if (Object.keys(attribution).length) sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));

    const sent = new Set<number>();
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const depth = available > 0 ? (window.scrollY / available) * 100 : 100;
      for (const threshold of [50, 90] as const) {
        if (depth >= threshold && !sent.has(threshold)) {
          sent.add(threshold);
          trackEvent({ name: "scroll_depth", percent: threshold });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [consent]);

  const choose = (value: Exclude<ConsentValue, null>) => {
    writeConsent(value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && <TagManager gtmId={gtmId} />}
      {consent === null && <ConsentBanner onAccept={() => choose("accepted")} onReject={() => choose("rejected")} />}
    </>
  );
}
```

Create the persistent footer control:

```tsx
// components/tracking/ConsentControl.tsx
"use client";

import { useEffect, useState } from "react";
import { readConsent, writeConsent, type ConsentValue } from "@/lib/consent";

export function ConsentControl() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  useEffect(() => setConsent(readConsent()), []);

  const toggle = () => {
    const next = consent === "accepted" ? "rejected" : "accepted";
    writeConsent(next);
    setConsent(next);
    if (next === "rejected") window.location.reload();
  };

  return (
    <button type="button" onClick={toggle}>
      {consent === "accepted" ? "Desativar medição" : "Ativar medição"}
    </button>
  );
}
```

Render `<ConsentControl />` in `SiteFooter`. Disabling reloads the page so already loaded third-party tag code is removed; after reload, `TrackingRoot` does not inject GTM. Add component tests for both directions, mocking `window.location.reload` safely.

- [ ] **Step 5: Mount once and document configuration**

Render `<TrackingRoot gtmId={process.env.NEXT_PUBLIC_GTM_ID} />` as the last child of `body` in `app/layout.tsx`.

```dotenv
# .env.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=
```

Google Ads, GA4 and Meta Pixel are configured inside the GTM container by the site owner. Document in `README.md` that `whatsapp_click` is the landing-page microconversion, while a scheduled lesson must be imported later as the real conversion using a non-PII workflow outside this repository.

- [ ] **Step 6: Run checks and commit**

```powershell
npm test -- components/tracking lib/analytics
npm run typecheck
npm run lint
npm run build
git add components/tracking app .env.example README.md
git commit -m "feat: add consent aware campaign measurement"
```

### Task 12: Add campaign SEO, social metadata and privacy page

**Files:**
- Create: `lib/site-url.ts`
- Create: `lib/site-url.test.ts`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/opengraph-image.tsx`
- Create: `app/politica-de-privacidade/page.tsx`
- Create: `app/politica-de-privacidade/privacy.module.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `README.md`

**Interfaces:**
- Reads: `NEXT_PUBLIC_SITE_URL` or Vercel production URL.
- Produces: canonical URL, title/description, Open Graph image, robots, sitemap and a real privacy destination.

- [ ] **Step 1: Write failing URL resolution tests**

```ts
// lib/site-url.test.ts
import { getSiteUrl } from "./site-url";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
});

it("prefers the explicit public URL", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://aulas.exemplo.com";
  expect(getSiteUrl().href).toBe("https://aulas.exemplo.com/");
});

it("normalizes the Vercel production host", () => {
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "priscilla.vercel.app";
  expect(getSiteUrl().href).toBe("https://priscilla.vercel.app/");
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- lib/site-url.test.ts`

Expected: FAIL because `getSiteUrl` does not exist.

- [ ] **Step 3: Implement deterministic site URL resolution**

```ts
// lib/site-url.ts
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}
```

- [ ] **Step 4: Add route metadata and social image**

Add `metadataBase: getSiteUrl()` to the existing root-layout metadata. Replace `app/page.tsx` with:

```tsx
// app/page.tsx
import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { getCampaign } from "@/content/landing-pages/registry";

const campaign = getCampaign("forro-do-zero");

export const metadata: Metadata = {
  title: campaign.meta.title,
  description: campaign.meta.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", title: campaign.meta.title, description: campaign.meta.description, images: [{ url: "/opengraph-image", alt: campaign.meta.ogAlt }] },
  twitter: { card: "summary_large_image", title: campaign.meta.title, description: campaign.meta.description, images: ["/opengraph-image"] },
};

export default function HomePage() {
  return <LandingPage campaign={campaign} />;
}
```

```tsx
// app/opengraph-image.tsx
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getCampaign } from "@/content/landing-pages/registry";
import { getSiteUrl } from "@/lib/site-url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const campaign = getCampaign("forro-do-zero");
  const mark = new URL("/brand/priscilla-castao-mark.svg", getSiteUrl()).toString();
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: 72, background: "#4B0D17", color: "#FAF5EC", fontFamily: "sans-serif" }}>
      <img src={mark} alt="" width="170" height="170" />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 30 }}>Priscilla Castão · Salvador, BA</div>
        <div style={{ maxWidth: 820, fontSize: 68, lineHeight: 1.05, fontWeight: 700 }}>{campaign.hero.title}</div>
      </div>
    </div>,
    size,
  );
}
```

This social image uses only the approved title and confirmed location; it does not invent review counts or claims.

- [ ] **Step 5: Add crawl routes and a plain-language privacy page**

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", getSiteUrl()).toString() };
}
```

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["/", "/politica-de-privacidade"].map((path) => ({ url: new URL(path, base).toString(), changeFrequency: "monthly" as const }));
}
```

```tsx
// app/politica-de-privacidade/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./privacy.module.css";

export const metadata: Metadata = { title: "Política de privacidade | Priscilla Castão", robots: { index: true, follow: true } };

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Link href="/">Voltar para a página de aulas</Link>
      <h1>Política de privacidade</h1>
      <p>Esta página apresenta as aulas de forró de Priscilla Castão e pode medir a navegação somente depois da sua escolha.</p>
      <h2>Dados de campanha e navegação</h2>
      <p>Após o consentimento, parâmetros de campanha como UTM, gclid e fbclid podem ser guardados nesta sessão para entender a origem da visita. Os eventos da página não devem conter nome, telefone nem o conteúdo da conversa.</p>
      <h2>Serviços de medição</h2>
      <p>Google Analytics, Google Ads e Meta podem ser configurados pelo Google Tag Manager. Eles só são carregados depois da aceitação. A escolha pode ser alterada pelo controle disponível no rodapé.</p>
      <h2>WhatsApp e Instagram</h2>
      <p>Os links para WhatsApp e Instagram levam a serviços externos, sujeitos às políticas dessas plataformas. A mensagem sugerida no WhatsApp pode ser editada antes do envio.</p>
      <h2>Contato</h2>
      <p>Dúvidas sobre esta página podem ser enviadas diretamente a Priscilla pelo WhatsApp.</p>
      <a href={buildWhatsAppUrl("5575981234176", "Oi, Priscilla! Tenho uma dúvida sobre a página e a privacidade.")}>Falar com Priscilla</a>
    </main>
  );
}
```

```css
/* app/politica-de-privacidade/privacy.module.css */
.page { width: min(100% - 2rem, 48rem); margin-inline: auto; padding-block: 2rem 5rem; }
.page h1 { margin-block: 2rem 1rem; font-size: clamp(2rem, 9vw, 4rem); line-height: 1.05; }
.page h2 { margin-top: 2rem; }
.page p { max-width: 65ch; }
.page a { display: inline-flex; min-height: 3rem; align-items: center; }
```

Do not add legal promises beyond this confirmed operational description.

- [ ] **Step 6: Validate rendered metadata and commit**

```powershell
npm test -- lib/site-url.test.ts
npm run typecheck
npm run lint
npm run build
git add app lib/site-url.ts lib/site-url.test.ts README.md
git commit -m "feat: add campaign metadata and privacy route"
```

### Task 13: Prove mobile quality, accessibility and production readiness

**Files:**
- Create: `e2e/landing.spec.ts`
- Create: `e2e/accessibility.spec.ts`
- Create: `e2e/tracking.spec.ts`
- Create: `lighthouserc.cjs`
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Exercises: production build at 320, 375, 390, 768, 1024 and 1440 px.
- Gates: no horizontal overflow, WhatsApp destination correct, sticky CTA lifecycle correct, reduced-motion complete, keyboard flow usable, axe has no serious/critical violations, Lighthouse mobile categories at least 90 and Core Web Vitals budgets respected.

- [ ] **Step 1: Write the cross-viewport Playwright contract**

```ts
// e2e/landing.spec.ts
import { expect, test } from "@playwright/test";

const widths = [320, 375, 390, 768, 1024, 1440];

for (const width of widths) {
  test(`landing page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  });
}

test("primary actions use the real WhatsApp number and encoded context", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("a[href*='wa.me/5575981234176']");
  await expect(links.first()).toBeVisible();
  expect(await links.count()).toBeGreaterThanOrEqual(3);
  await expect(links.first()).toHaveAttribute("href", /text=.+/);
});

test("reduced motion leaves every section visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const id of ["inicio", "metodo", "depoimentos", "aulas", "sobre", "como-comecar", "duvidas"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/campanha-inexistente");
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 2: Add accessibility and tracking tests**

```ts
// e2e/accessibility.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});
```

```ts
// e2e/tracking.spec.ts
import { expect, test } from "@playwright/test";

test("WhatsApp still opens when dataLayer is unavailable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "dataLayer", { configurable: true, get: () => undefined }));
  await page.goto("/");
  const link = page.locator("#hero-primary-cta");
  const href = await link.getAttribute("href");
  await link.click();
  expect(href).toContain("wa.me/5575981234176");
});
```

Add these cases to the same files:

```ts
// append to e2e/landing.spec.ts
test("mobile sticky CTA appears between hero and closing CTA", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sticky = page.getByTestId("mobile-sticky-cta");
  await expect(sticky).toBeHidden();
  await page.locator("#metodo").scrollIntoViewIfNeeded();
  await expect(sticky).toBeVisible();
  await page.locator("#final-primary-cta").scrollIntoViewIfNeeded();
  await expect(sticky).toBeHidden();
});

test("FAQ works from the keyboard", async ({ page }) => {
  await page.goto("/#duvidas");
  const firstSummary = page.locator("#duvidas summary").first();
  await firstSummary.focus();
  await page.keyboard.press("Enter");
  await expect(firstSummary.locator("..")).toHaveAttribute("open", "");
});
```

```ts
// append to e2e/tracking.spec.ts
test("accepted consent enables privacy-safe page events", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Aceitar medição" }).click();

  await page.locator("#hero-primary-cta").evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true });
    (element as HTMLElement).click();
  });
  await page.locator("#duvidas summary").first().click();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  await expect.poll(() => page.evaluate(() => window.dataLayer ?? [])).toEqual(expect.arrayContaining([
    expect.objectContaining({ event: "whatsapp_click", placement: "hero", offer: "individual" }),
    expect.objectContaining({ event: "faq_open" }),
    expect.objectContaining({ event: "scroll_depth", percent: 50 }),
    expect.objectContaining({ event: "scroll_depth", percent: 90 }),
  ]));
});

test("rejected consent stays rejected and emits no campaign events", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continuar sem medição" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Aceitar medição" })).toHaveCount(0);
  expect(await page.evaluate(() => window.dataLayer ?? [])).toEqual([]);
});
```

Add a proof-link click in `tracking.spec.ts` using the same local `preventDefault` pattern and assert `{ event: "proof_open", source: "instagram" }`. Add a format CTA click and assert `format_select` occurs once before `whatsapp_click`. Abort network requests whose hostname is `googletagmanager.com`, `google-analytics.com`, `facebook.net`, `instagram.com` or `wa.me`; never send test traffic to third parties.

- [ ] **Step 3: Configure repeatable Lighthouse CI budgets**

```js
// lighthouserc.cjs
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      url: ["http://localhost:3000/"],
      numberOfRuns: 3,
      settings: { formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false } },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
```

Keep the explicit mobile form factor and emulation shown above. Record the working Lighthouse/Chrome versions in `README.md`; INP remains a post-launch field-data target because a static Lighthouse navigation may not produce a meaningful interaction sample.

- [ ] **Step 4: Run the complete local quality gate**

```powershell
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run lighthouse
```

Expected: all commands exit 0; every tested viewport has zero horizontal overflow; the exact WhatsApp number is present; axe serious/critical count is zero; Lighthouse categories are at least 0.90; LCP is below 2500 ms; CLS below 0.1; INP is checked in field data after launch because a lab run may report no value.

- [ ] **Step 5: Perform manual production review**

Start the production server and inspect 320 px, 390 px and 1440 px with browser devtools:

```powershell
npm run build
npm run start
```

Confirm: no clipped text; browser zoom remains enabled; body text is at least 16 px with 1.5–1.75 line height; touch targets are at least 48×48 px with 8 px separation; hero image has no harmful crop; testimonial names and quotations match Instagram; location remains flexible in Salvador; prices are not invented; the sticky bar respects the safe area; motion has no mobile parallax or scroll hijacking; reduced-motion is static and complete; all external destinations are correct.

Compare Newsreader only against Plus Jakarta Sans at 320, 390 and 768 px for the exact quotations/headings where it is used. Keep it only if accents, punctuation and line breaks remain immediately readable; otherwise remove the Newsreader import, variable and CSS usage before the quality gate. This is a typography legibility check, not a comparison between landing-page layouts.

- [ ] **Step 6: Curate and commit the public project documentation**

Update `README.md` so its links match files that will actually be public and add setup, environment variables, test commands, campaign-content workflow, consent behavior and deployment notes. Review `docs/direction/`, `docs/planning/`, `docs/research/` and `assets/instagram/ASSETS.md` for secrets, private identifiers or raw copied metadata. Keep authored analysis and public source links; do not add original media or downloaded Instagram JSON.

```powershell
git add README.md docs/direction docs/planning docs/research assets/instagram/ASSETS.md
git diff --cached --check
git commit -m "docs: add project research and operating guide"
```

- [ ] **Step 7: Audit the publish set and repository history**

```powershell
git status --short
git ls-files
git log --oneline --decorate -12
```

Expected: only source, tests, documentation and the four approved WebP/SVG assets are tracked. `.venv`, `tools`, `references`, diagnostics, Instagram JSON, secrets, original JPG/PNG downloads, Lighthouse reports and Playwright artifacts remain ignored. Remove no user-owned files; adjust `.gitignore` if an excluded category appears.

- [ ] **Step 8: Request final approval before publishing**

Present the production URL or local preview, the final copy, proof attribution and quality-gate results to the user. Do not push until the user explicitly approves this implemented version.

- [ ] **Step 9: Publish safely to the approved empty repository**

After approval, verify the destination one last time and push without force:

```powershell
git branch -M main
git remote -v
git remote add origin https://github.com/acssjr/priscillacastao_lps.git
git push -u origin main
```

If `origin` already exists, verify that it equals `https://github.com/acssjr/priscillacastao_lps.git` and omit `git remote add`. If the remote has gained commits, stop and reconcile deliberately; never force-push over them.
