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
- [ ] Add/restore reliable lint command compatible with current Next.js version
- [ ] Add tests for text matching and state transitions

## Validation workflow

- Run type checking/build before merge.
- Manually verify one full conversation end-to-end in Chrome.
- Confirm browser warning appears for unsupported/partial browsers.
