# Development Guide

## Stack

- Next.js App Router
- TypeScript + React
- Tailwind CSS
- Web Speech API + Web Audio API

## Repository structure

- `app/`: routes and page-level UI
- `components/`: reusable UI and feature components
  - `CompletionPopup/` — Modal popup showing completion stats (total sentences, completed, retries, fluency %, overall score)
  - `CompletionPopupTester.tsx` — Global floating test button for CompletionPopup (dev tool, mounted in root layout)
  - `CompletionScreen/` — Full-page completion screen with audio playback
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

- **Skip during AI speech**: The Skip button is active during the `ai_speaking` state. Pressing it cancels TTS via `speechSynthesis.cancel()`, guards against stale `onEnd` callbacks, and advances directly to the next line.
- **Deterministic card ordering**: Dashboard card selection uses alphabetical sort by `id` instead of `Math.random()` to avoid SSR hydration mismatches.

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

## Internationalization (i18n)

The UI supports **Vietnamese** (default) and **English** via `next-intl`.

### Architecture

- **`lib/locale.ts`** — `Locale` type (`'en' | 'vi'`), `DEFAULT_LOCALE = 'vi'`, `LOCALE_STORAGE_KEY = 'app-locale'`.
- **`components/LocaleProvider.tsx`** — Wraps the app with `NextIntlClientProvider`. Reads/writes `localStorage` for persistence. Sets `document.documentElement.lang` on change.
- **`components/LanguageToggle.tsx`** — Icon button (Material Symbols `translate`) placed in `TopNav` and `AppHeader`. Toggles between VI ↔ EN.
- **`messages/en.json`** / **`messages/vi.json`** — Translation strings organized by namespace (~14 namespaces, ~150 keys each).

### Adding a new translation key

1. Add the key + English text to `messages/en.json` under the appropriate namespace.
2. Add the key + Vietnamese text to `messages/vi.json` under the same namespace.
3. In your component, call `useTranslations('namespace')` and use `t('key')`.

### Namespaces

| Namespace | Used by |
|-----------|---------|
| `nav` | TopNav, AppHeader |
| `hero` | HeroSection |
| `journey` | JourneySection, scenarios page |
| `stats` | StatsSection |
| `footer` | BottomFooter |
| `mobile` | Mobile dashboard (page.tsx) |
| `scenarios` | Scenarios page |
| `conversation` | ExampleConversationScreen |
| `chat` | ChatContainer, MessageBubble |
| `voice` | VoiceRecorder |
| `hint` | ScriptHint |
| `matchingResult` | MatchingResultDisplay |
| `completion` | CompletionScreen, CompletionPopup |
| `browser` | BrowserWarning |
| `feedback` | MatchingResultDisplay (via `getMatchingMessageKey`) |
| `audio` | AudioPlayer |

### Text matching feedback

`lib/textMatching.ts` exports `getMatchingMessageKey(similarity)` which returns a translation key (e.g. `'perfect'`, `'great'`). The caller translates via `useTranslations('feedback')`.

### Font

**Be Vietnam Pro** (Google Font) — loaded via `<link>` in `app/layout.tsx`. Replaces the previous Spline Sans + Manrope fonts. Supports full Vietnamese character set including diacritics.

### Conversation scripts

Conversation dialogue scripts in `data/conversations.ts` remain in **English only** — they are learning content, not UI text.

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
