# Landing Page Redesign — What Changed

Only these files changed. Drop them into your existing project at the same paths
(they will overwrite the old versions) — nothing else in your project needs to change.

## Files in this package
- `index.html` — added Google Font (Space Grotesk) for headings
- `src/index.css` — added a gold/coin accent color, the animated coin-motif
  hero background (dot-grid + soft gradient blobs + floating coins), and
  carousel styling
- `src/components/common/Carousel.tsx` — **new file**: a lightweight, no-dependency
  page carousel (autoplay, prev/next arrows, dot indicators, responsive:
  1 card on mobile, 2 on tablet, N on desktop)
- `src/pages/public/Home.tsx` — rewritten hero (animated entrance via `motion`,
  coin-themed background instead of a plain flat section) + the 6 feature
  cards now scroll as an auto-playing carousel + a new "What Students Are
  Saying" testimonial carousel
- `src/components/common/Navbar.tsx` — one-line change: brand name now uses
  the new display font for consistency

## Why no stock photo?
I deliberately avoided dropping in a generic stock photo of students, since:
1. It's the most common "AI landing page" cliché and looks templated.
2. Real photos of real people carry licensing/attribution risk.
3. Your app is literally called "Campus Coin" — a coin-motif animated
   background (floating coins, soft blobs, dot grid) ties directly to your
   brand instead of a generic photo, and it works offline with zero
   external image dependencies.

If you do want a real photo behind the hero instead, replace the
`<CoinBackdrop />` component call in `Home.tsx` with a `<div>` using
`bg-[url('/your-image.jpg')] bg-cover bg-center opacity-20` — happy to wire
that up if you send me the image.

## Animations used
- `motion` (already in your package.json) powers a staggered fade-up entrance
  on the hero text/buttons, and a fade-up-on-scroll reveal on the sitemap
  banner.
- Pure CSS keyframes power the floating coins (respects
  `prefers-reduced-motion`).
- The carousels use CSS transforms with an easing curve for smooth sliding.

## Nothing else was touched
Your backend (`server/`), auth, dashboard, transactions, budgets, reports,
admin panel, etc. are untouched — this is purely the public landing page +
one shared component + global styles.
