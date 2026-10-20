# FlowPilot Landing Page

Build the FlowPilot landing page from Figma as a responsive React app. Act as a senior front-end developer: plan first, build step by step, and keep code clean and tested.

## Figma (source of truth)

File key: `WAHeIX5DCB0FAYZ2lOcr6d`

- Desktop (1440 frame, 1280 wide): https://www.figma.com/design/WAHeIX5DCB0FAYZ2lOcr6d/Flow-Pilot?node-id=1-580&m=dev (node `1:580`)
- Responsive (375 wide): https://www.figma.com/design/WAHeIX5DCB0FAYZ2lOcr6d/Flow-Pilot?node-id=2-1005&m=dev (node `2:1005`)

Before building each section, read both nodes (`get_metadata`, `get_design_context`, `get_screenshot`) and match the design. Load the `figma:figma-design-to-code` skill before calling `get_design_context`.

## Tech stack (fixed, do not swap)

- React + TypeScript (strict)
- Tailwind CSS
- react-hook-form with zod 4 for validation. Keep `@hookform/resolvers` on v5: v6 fails to install because of conflicting optional peer dependencies. Use `useWatch`, not `watch`.
- React Testing Library (+ `user-event`, `jest-dom`)
- Swiper, only for the TrustedBy logo marquee (added at the user's request)

## Rules

- Page width: every section wraps its content in `<Container />` (the global `.container` class in `src/index.css`). Never add your own side padding or max width for the page. The gutters (1.25rem mobile, 4rem from `lg`) and the 90rem cap come from the `gutter`, `gutter-lg` and `container` tokens in `tailwind.config.ts`. Full-bleed parts (the TrustedBy slider) and the Figma-specific mobile menu are the only exceptions.
- No fixed heights or widths: never put numeric size classes on a component (`h-20`, `w-27`, `size-11`, `h-[80px]`, `w-[300px]`), because content will grow. A box gets its size from its content plus padding, margin and gap. When Figma shows a fixed size, work out the padding that produces it (e.g. an 80px card holding 40px of text with 1px borders needs 19px of vertical padding) and use that, for mobile and desktop separately. Allowed: `w-full`, `w-max`, `w-fit`, `flex-1`, grid columns, and `max-w-*` / `min-w-*` caps for readable line length and page width. Decorative shapes with no text inside (icon tiles, checkbox squares) may keep `size-*` because the shape itself is the design.
- Token names: never give a shadow or a font size the same name as a colour in `tailwind.config.ts` (`shadow-card` once rendered near-white because `card` is also a colour). `src/test/tailwindConfig.test.ts` checks this.
- Responsive is mandatory: build mobile-first (375px default), desktop layout from `lg:` (1024px). Both Figma frames must be matched.
- Take real copy and pricing from the desktop frame; use the mobile frame for layout. Ignore Figma placeholder names (e.g. "Contact form reference").
- Design tokens live in `tailwind.config.ts`: primary `#2F5BFF`, violet `#7B4DFF`, text `#101828`, muted `#667085`, border `#DCE3F0`. No hardcoded hex values in components.
- Content is data-driven: typed arrays in `src/data/`, sections map over them.
- Accessibility: semantic landmarks, ARIA on tabs, toggle and form errors, full keyboard support.
- Tests query by role and label, not test IDs. Every interactive piece gets tests.
- Work one section at a time and compare against the Figma screenshots before moving on.

## Structure

```
src/
├─ components/ui/        Button, Badge, Card, Container, Field, Toggle, Tabs, ProgressBar, icons/
├─ components/layout/    Header (+ MobileMenu), Footer
├─ components/sections/  Hero, TrustedBy, Capabilities, Workflow, Testimonials, Pricing, Contact
├─ data/  types/  hooks/  test/
```

## Build order

1. Scaffold, config, tokens, test setup
2. UI primitives
3. Header, Hero, Footer
4. Capabilities, TrustedBy, Workflow
5. Testimonials, Pricing
6. Contact (react-hook-form + zod + tests)
7. Visual comparison, responsive check, then lint, typecheck and tests

## Open decisions (defaults apply unless the user says otherwise)

- Project location: `D:\haseeb\claude-task\flowpilot`
- Test runner: Vitest
- Tablet (`md:`) layout: decided by me, since Figma only has 375 and 1280

## Must-remember notes from the user

<!-- Add the user's own always-remember items below -->
