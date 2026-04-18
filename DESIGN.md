# Design Brief

## Intent & Tone
Professional portfolio showcase with contemporary editorial luxury. Dark-first, sharp precision, geometric depth—inspired by Linear and Stripe. Accent color as catalyst, not support.

## Palette
| Role | OKLCH | Purpose |
|------|-------|---------|
| Background (light) | 0.98 0 0 | Clean white, maximizes contrast |
| Background (dark) | 0.12 0 0 | Deep charcoal, premium tech feel |
| Foreground | 0.95 0 0 / 0.12 0 0 | Text layer, high contrast both modes |
| Primary (accent hub) | 0.5 0.1 257 / 0.75 0.12 257 | Deep indigo; CTAs, hover states |
| Accent (highlight) | 0.65 0.18 38 / 0.7 0.2 38 | Warm amber-orange; sparingly for emphasis |
| Border | 0.92 0 0 / 0.24 0 0 | Subtle structure, zero saturation |
| Destructive | 0.55 0.22 25 | Red for errors/delete actions |

## Typography
**Display:** Figtree (geometric, approachable) — headings, hero, section titles.
**Body:** DMSans (refined, neutral) — paragraphs, descriptions, micro-copy.
**Mono:** GeistMono — code snippets, technical details.
Scale: 12/14/16/18/24/32/40/48 px (base 16px).

## Elevation & Depth
Minimal layering: `bg-background` (main), `bg-card` (elevated), `bg-muted/5` (subtle divisions). Shadows use `shadow-subtle` (2–4px depth) and `shadow-elevated` (12–24px depth). No glow effects.

## Structural Zones
| Zone | Surface | Divider | Intent |
|------|---------|---------|--------|
| Header | `bg-card` | `border-b` | Anchored, readable |
| Hero | `bg-gradient-accent` overlay | N/A | Visual impact, emotion |
| Content Sections | `bg-background` + alternating `bg-muted/5` | None | Rhythm, breathing room |
| Project Cards | `bg-card` | `shadow-subtle` | Modular, distinct |
| Footer | `bg-muted/5` | `border-t` | Grounded, secondary |

## Component Patterns
- **Buttons:** Solid primary background, hover +10% lightness. Accent buttons reserve for high-intent actions.
- **Forms:** Input `bg-card` border `border-border`, focus ring `ring-accent`.
- **Project Cards:** Image overlay, title overlay (semi-transparent), tech tags as small secondary badges.
- **Navigation:** Smooth underline on hover, no background shift.

## Motion
Default: `transition-smooth` (0.3s cubic-bezier) on all interactive elements. Hero entrance: staggered fade-in (titles first, then CTA). No bounce or elastic effects.

## Constraints
- No rainbow palettes. Accent used sparingly (< 15% of UI).
- Light mode: always verify AA+ contrast (L diff ≥ 0.7). Dark mode: same rigor.
- Avoid rounded corners on headers/footers (use sm: 4px only).
- Never use raw hex or `#fff`—consume via OKLCH tokens only.

## Signature Detail
Gradient accent bar (warm to cool) on hero section and featured project cards. Introduces color without overwhelming. Connects visual identity across pages.
