# Design System

Design source: Stitch-based screens for conversation list, chat, and session summary.

## Foundations

- Primary color: `#00d1ae`
- Light background: `#faf8f4`
- Dark background: `#22252a`
- Main text (light): `#1e293b`
- Success/Star: `#f59e0b`
- Error: `#ef4444`

## Typography

- Primary font: Be Vietnam Pro (Google Font, full Vietnamese character support)
- Typical body: `text-[15px] font-medium`
- Card title: `text-base font-bold`
- Labels: uppercase, tight tracking, small size (`10px`-`11px`)

## Layout

- Mobile-first, centered container: `max-w-md mx-auto`
- Standard horizontal padding: `px-4`
- Bottom-safe content spacing when fixed nav/footer exists

## Component conventions

- Header with sticky/backdrop blur behavior
- AI bubble left / user bubble right
- Progress shown as `current / total` with visual bar
- Recording state uses pulsing indicator and clear status text
- Completion screen uses compact stats cards and audio playback block

## Interaction patterns

- Press states: `active:scale-95`
- Soft transitions: `transition-all` or `transition-transform`
- Use Material Symbols for consistent icon style

## Scope guardrails

- Reuse current Tailwind primitives and app tokens.
- Avoid introducing new color systems or custom shadows outside existing style language.
- Prefer minimal, clear UI over adding extra controls.
