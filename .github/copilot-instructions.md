# English Speaking Practice Web App - AI Coding Agent Instructions

## Project Overview

Interactive web app for English speaking practice using AI-guided conversations. Users speak scripted dialogues; the app evaluates pronunciation accuracy in real-time using browser Web Speech APIs. **Client-side only - no backend, no external API calls.**

**Tech Stack**: Next.js 14+ (App Router), TypeScript, React 18+, Tailwind CSS, Web Speech API

## Architecture & Data Flow

### Core Application Flow

1. User selects conversation from list → navigates to `/chat/[conversationId]`
2. AI speaks first line via Web Speech Synthesis API (text appears immediately in bubble)
3. User clicks "Tap to Speak" → Visual recording indicator appears (pulsing microphone)
4. Speech recognition listens for 5 seconds or until user clicks Stop button
5. Web Speech Recognition API transcribes user's speech
6. Stop button processes any detected speech (even interim results)
7. Text matching algorithm (Levenshtein distance) compares transcript to expected script
8. User sees their spoken text vs. expected text in message bubble (stays visible)
9. If match <80%: Show comparison in red box, allow retry (max 3 attempts) or Skip
10. If match ≥80%: Show success, proceed to next line
11. After 3 failed attempts: show correct answer, then continue
12. User can Skip difficult lines at any time
13. All user audio recordings merge at conversation end for playback

### State Machine (useConversationBot hook)

```
idle → ai_speaking → waiting_for_user → processing →
  → success (≥80%) → next line
  → retry (<80%, attempts < 3) → waiting_for_user
  → show_answer (attempts = 3) → next line
→ completed (all lines done)
```

### Project Structure (Not Yet Implemented)

```
src/
├── app/
│   ├── page.tsx                    # Conversation list screen
│   └── chat/[conversationId]/
│       └── page.tsx                # Chat screen with bot logic
├── components/
│   ├── ConversationList/           # Card grid display
│   ├── Chat/                       # Message bubbles, voice recorder
│   └── AudioPlayer/                # Final recording playback
├── hooks/
│   ├── useSpeechRecognition.ts     # Web Speech API wrapper
│   ├── useSpeechSynthesis.ts       # TTS wrapper
│   ├── useConversationBot.ts       # State machine logic
│   └── useAudioRecorder.ts         # Audio capture & merging
├── lib/
│   ├── textMatching.ts             # Levenshtein similarity
│   ├── audioUtils.ts               # Audio blob merging
│   └── constants.ts                # Thresholds & config
└── data/
    └── conversations.ts            # Static conversation scripts
```

## Critical Implementation Details

### Text Matching Algorithm (lib/textMatching.ts)

- **Must normalize**: lowercase, remove punctuation, trim/collapse spaces
- **Formula**: `similarity = ((maxLength - levenshteinDistance) / maxLength) * 100`
- **Pass threshold**: 80% (`MATCHING_THRESHOLD = 80`)
- **Max retries**: 3 (`MAX_RETRY_ATTEMPTS = 3`)

### Web Speech API Configuration

```typescript
// Speech Recognition
const recognitionConfig = {
  lang: 'en-US',
  continuous: false,
  interimResults: true,
  maxAlternatives: 3,
};

// Speech Synthesis
const speechConfig = {
  lang: 'en-US',
  rate: 0.9, // Slightly slower for clarity
  pitch: 1.0,
};
```

### Audio Recording (useAudioRecorder hook)

- Capture each user turn as separate blob
- Store all blobs in array during conversation
- Merge blobs on completion using Web Audio API
- Format: WebM/Opus or WAV, 44100Hz, mono, 16-bit

### Browser Compatibility

**Primary**: Chrome (full support)  
**Secondary**: Edge, Safari (partial support)  
**Unsupported**: Firefox  
→ **Must include browser check on app load** - show warning for unsupported browsers

## TypeScript Interfaces

```typescript
interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  lines: ConversationLine[];
}

interface ConversationLine {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string;
}
```

## UI/UX Conventions

- **Message bubbles**: AI left-aligned, User right-aligned
- **Visual feedback**: Show matching percentage immediately after user speaks
- **Progress indicator**: Display current line / total lines
- **Retry counter**: "Attempts: X remaining" visible during user turns
- **Auto-scroll**: Scroll to latest message after each turn
- **Responsive**: Must work on mobile and desktop

## UI/UX Enhancements

### Visual Recording Indicator
- **Pulsing microphone animation** when recording
- **Red "🔴 Recording..." text** with pulse effect
- **Expanding rings** around microphone icon
- **Helper text**: "Speak clearly into your microphone"

### User Transcript Display
- **Before speaking**: Only expected text shown in hint section
- **After speaking**: Message bubble shows comparison:
  - "You said:" (user's actual transcript)
  - "Expected:" (correct script)
- **Failed attempts**: Red box with side-by-side comparison
- **Wrong answers persist**: Stay visible in conversation history

### Timeouts & Controls
- **Auto-stop**: 5 seconds after starting to speak
- **Manual stop**: Stop button accepts any detected speech
- **Skip button**: Bypass difficult lines, move to next
- **Retry counter**: Shows attempts remaining (max 3)

## Key Developer Commands

```bash
# Setup
npm install
npm run dev          # http://localhost:3000

# Build & Test
npm run build
npm run start
npm run test
npm run test:coverage
```

## Error Handling Requirements

1. **Microphone permission denied** → Show clear error with instructions to enable
2. **Speech recognition error** → Provide retry button, fallback message
3. **Unsupported browser** → Display warning on load, suggest Chrome
4. **Audio merge failure** → Gracefully degrade (skip playback, show message)

## State Management

- Use React hooks (`useState`, `useReducer`) for local state
- Context API for shared conversation state if needed across components
- No Redux/Zustand - keep it simple for MVP

## Testing Focus

- Text matching algorithm accuracy (various inputs, edge cases)
- Conversation state transitions (all paths in state machine)
- Component rendering (message bubbles, progress tracking)
- Mock Web Speech API for tests (not available in test env)

## Important Constraints

- **No backend** - all processing client-side
- **No external APIs** - use only browser Web Speech APIs
- **No authentication** - no user accounts in MVP
- **Static conversations** - scripts hardcoded in `data/conversations.ts`

## Sample Conversations (data/conversations.ts)

Initial conversations to implement:

- Restaurant Order (Beginner, 10-12 lines)
- At the Airport (Intermediate, 12-15 lines)
- Job Interview (Advanced, 15-20 lines)
- Doctor Visit (Intermediate, 10-12 lines)

Each conversation must have alternating `ai`/`user` speakers.

## References

- Full requirements: [docs/requirement.md](../docs/requirement.md)
- Development guide: [docs/instruction.md](../docs/instruction.md)
