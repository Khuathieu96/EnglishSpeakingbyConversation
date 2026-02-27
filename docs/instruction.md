# Development Guide

## Stack

- Next.js App Router
- TypeScript + React
- Tailwind CSS
- Web Speech API + Web Audio API

## Repository structure

- `app/`: routes and page-level UI
- `components/`: reusable UI and feature components
- `hooks/`: speech, recording, and conversation state hooks
- `lib/`: text matching, audio utilities, constants
- `data/`: static conversation scripts
- `types/`: shared TypeScript interfaces

## Core flow

1. User selects a conversation.
2. AI line is spoken via speech synthesis.
3. User records a response.
4. Transcript is matched against expected text.
5. Result decides next state: success, retry, or show answer.
6. Session completion shows summary and merged audio.

## State machine

`idle → ai_speaking → waiting_for_user → processing → success|retry|show_answer → completed`

## Key constants

Defined in `lib/constants.ts`:

- Matching threshold: `80`
- Max retry attempts: `3`
- Recognition language: `en-US`

## Browser support

- Full: Chrome, Edge
- Partial: Safari
- Limited: Firefox

Always keep browser capability checks for speech APIs and microphone access.

## Development workflow

```bash
npm install
npm run dev
npm run build
```

## Refactor guidelines

- Prefer explicit types over `any`.
- Remove unused imports and dead branches.
- Keep naming intention-revealing (`hasSpeechRecognitionApi` vs unclear names).
- Keep behavior unchanged unless fixing a bug.
