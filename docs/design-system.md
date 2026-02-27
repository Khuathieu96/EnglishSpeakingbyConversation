# Design System

Design source: Stitch-based screens for conversation list, chat, and session summary.

## Foundations

### SEC Color Palette

Source: [Shared palette](https://imagecolorpicker.com/en/user/shared-palette?id=ip5wp84y1ecp9sutq2224248)

| Swatch | Hex | Role |
|--------|-----|------|
| 🟠 | `#fc6c02` | Primary (orange, `--color-primary`) |
| 🟠 | `#fe8403` | Primary light / hover |
| 🟠 | `#fd9b0a` | Amber accent |
| 🔵 | `#144491` | Secondary (navy blue, `--color-secondary`) |
| 🔵 | `#2f71a2` | Secondary light / info |
| 🟡 | `#fdb212` | Gold / highlight |
| 🟡 | `#e3a94d` | Warm gold / muted accent |
| 🟡 | `#fee5ab` | Cream / light accent background |
| ⚪ | `#f4faf4` | Light background (near-white) |

### Additional tokens

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
- CompletionPopup modal: fixed overlay `z-[1000]`, white card, check_circle icon, 3-column stats grid, overall score progress bar, two action buttons

### Primary buttons

- Background: `var(--color-primary)` (orange)
- Text: `#fff` (white) — unified across `.startButton`, `.primaryCta`, `.levelActive`
- Shadow: `0 2px 8px rgba(252, 108, 2, 0.15)`

### Dashboard cards

- Image height: `164px`, no border-radius on image wrapper
- Card uses `overflow: hidden` to clip image via parent border-radius
- Image wrapper bleeds past parent padding via negative margins (`margin: -21px -21px 16px`)
- Desktop grid: 4 cards per row (`flex: 0 0 calc((100% - 72px) / 4)`)
- Difficulty badges and time badges are **not shown** on dashboard or scenarios cards

## Interaction patterns

- Press states: `active:scale-95`
- Soft transitions: `transition-all` or `transition-transform`
- Use Material Symbols for consistent icon style

## Scope guardrails

- Reuse current Tailwind primitives and app tokens.
- Avoid introducing new color systems or custom shadows outside existing style language.
- Prefer minimal, clear UI over adding extra controls.
