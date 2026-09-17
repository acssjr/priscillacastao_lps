# Dynamic Landing Redesign

## Objective

Reduce reading fatigue and give the page a consistent visual signature without changing the offer or inventing claims. Every portrait-led section uses a burgundy card with a transparent cutout that crosses the card's top edge. Text-heavy sections alternate between compact cards, an existing carousel, progressive disclosure, and short editorial copy.

## Visual system

- Keep the existing burgundy, red, terracotta, and paper palette.
- Remove cream highlight blocks from the hero; use a wine-to-red gradient.
- Treat the hero headline as one visual unit with three balanced lines: `Aprenda forró`, `DO ZERO`, `no seu ritmo.`
- Use one reusable portrait-card component for hero, method, proof, and about. The subject may cross only the top edge; body and sides remain contained.
- Cards use rounded corners, a subtle diagonal texture, a bottom readability gradient, and restrained borders.

## Page rhythm

- Recognition becomes three concise benefit cards instead of three paragraphs.
- Method keeps its three teaching pillars as interactive cards beside a portrait card.
- Proof remains the one auto-advancing carousel and receives the shared portrait-card treatment.
- Formats remain selectable offer cards with clearer hierarchy.
- About becomes a concise profile panel with a portrait card.
- Process becomes a connected three-step visual sequence with shorter copy.
- FAQ remains native progressive disclosure.

## Motion

Motion exists for explanation, state indication, and preventing jarring changes. Cards reveal once on entry, carousels communicate slide state, and hover feedback is limited to fine pointers. Motion uses transform and opacity, respects `prefers-reduced-motion`, and never moves long-form reading text continuously.

## Content

Preserve factual meaning and current commercial boundaries. Tighten repeated sentences, remove procedural wording such as “mensagem pronta,” and keep unsupported proof or claims out of the page.

## Responsive behavior

Mobile alternates copy and cards in a single flow. Desktop uses paired copy/media compositions and compact grids. Interactive targets remain at least 44px and all carousels retain keyboard controls and accessible labels.

## Verification

- Component tests cover the unified hero title, recognition cards, portrait cards, and accessible interactive controls.
- Validate 430x932 and 1440x1000 visually.
- Run the full Vitest suite, TypeScript, production build, and `git diff --check`.
