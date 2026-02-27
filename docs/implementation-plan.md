# Implementation Plan

## Current status

- Core conversational flow is implemented.
- Web Speech recognition/synthesis hooks are implemented.
- Text matching and retry logic are implemented.
- Completion and audio review flow exist.

## Ongoing refactor goals

1. Keep docs centralized under `/docs`.
2. Remove weak typing and dead code paths.
3. Keep hook/state-machine behavior deterministic.
4. Keep UI consistent with the design system.

## Refactor checklist

- [x] Consolidate duplicate documentation into `/docs`
- [x] Remove root markdown duplicates
- [x] Improve type safety in key chat/speech modules
- [x] Add multilingual UI support (Vietnamese / English) with `next-intl`
- [x] Replace Spline Sans + Manrope fonts with Be Vietnam Pro
- [x] Add `LanguageToggle` component to both headers (TopNav & AppHeader)
- [x] Add translation files (`messages/en.json`, `messages/vi.json`)
- [x] Refactor `getMatchingMessage` to return translation keys
- [x] Skip button cancels AI speech mid-playback (`ai_speaking` state)
- [x] CompletionPopup modal component (Figma-based design)
- [x] CompletionPopupTester global floating dev button
- [x] Fix hydration error — deterministic card ordering (replace `Math.random`)
- [x] Dashboard card styling polish (164px image height, overflow hidden, 4-per-row grid)
- [x] Remove difficulty badges from dashboard and scenarios cards
- [x] Remove time badges from scenarios cards
- [x] Unify primary button text color to white (`#fff`)
- [ ] Add/restore reliable lint command compatible with current Next.js version
- [ ] Add tests for text matching and state transitions

## Validation workflow

- Run type checking/build before merge.
- Manually verify one full conversation end-to-end in Chrome.
- Confirm browser warning appears for unsupported/partial browsers.
