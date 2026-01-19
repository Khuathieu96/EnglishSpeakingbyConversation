# English Speaking Practice Web App - Development Instructions

## Project Overview

This is a web application designed to help users practice English speaking through AI-guided conversations. Users follow scripted dialogues, and the AI bot evaluates their pronunciation and accuracy in real-time.

## Tech Stack

- **Framework**:  Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**:  Tailwind CSS
- **Speech Recognition**: Web Speech API (SpeechRecognition)
- **Text-to-Speech**: Web Speech Synthesis API
- **Audio Processing**:  Web Audio API

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Conversation list screen
│   ├── chat/
│   │   └── [conversationId]/
│   │       └── page.tsx            # Chat screen
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ConversationList/
│   │   ├── ConversationCard.tsx    # Individual conversation card
│   │   └── index.tsx               # List container
│   ├── Chat/
│   │   ├── ChatContainer.tsx       # Main chat wrapper
│   │   ├── MessageBubble.tsx       # AI/User message bubble
│   │   ├── VoiceRecorder.tsx       # Microphone recording component
│   │   ├── MatchingResult.tsx      # Display matching percentage
│   │   └── index.tsx               # Chat exports
│   ├── AudioPlayer/
│   │   └── index.tsx               # Final recording playback
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ProgressBar.tsx
├── data/
│   └── conversations. ts            # Conversation scripts data
├── hooks/
│   ├── useSpeechRecognition.ts     # Speech-to-text hook
│   ├── useSpeechSynthesis.ts       # Text-to-speech hook
│   ├── useConversationBot.ts       # Main bot logic hook
│   └── useAudioRecorder.ts         # Audio recording hook
├── lib/
│   ├── textMatching.ts             # Text similarity algorithm
│   ├── audioUtils.ts               # Audio processing utilities
│   └── constants.ts                # App constants
└── types/
    └── index.ts                    # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Modern browser with Web Speech API support (Chrome recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd english-speaking-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Core Features Implementation

### 1. User Experience Enhancements

**Visual Recording Feedback**
- Animated pulsing microphone with expanding rings
- "🔴 Recording..." text indicator
- Appears immediately when user starts speaking
- Located above control buttons

**Transcript Comparison Display**
- Shows "You said" vs "Expected" in user message bubbles
- Persists in conversation history (doesn't disappear)
- Red highlighting for failed attempts
- Side-by-side comparison in MatchingResult component

**Smart Speech Recognition**
- 5-second automatic timeout (reduced from 10s)
- Stop button processes partial/interim speech results
- Manual stop accepts any detected text
- Continuous recording until timeout or manual stop

**User Controls**
- **Tap to Speak**: Starts voice recording
- **Stop Button**: Appears during recording, processes speech immediately
- **Skip Button**: Bypass difficult lines without penalty
- **Retry**: Up to 3 attempts with persistent feedback

### 2. Conversation Data Structure

Location: `src/data/conversations.ts`

```typescript
interface ConversationLine {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
}

interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  lines: ConversationLine[];
}
```

### 2. Speech Recognition Setup

Location: `src/hooks/useSpeechRecognition. ts`

- Initialize Web Speech API
- Handle browser compatibility
- Manage recognition state (listening, processing, error)
- Return transcript and confidence score

### 3. Text Matching Algorithm

Location: `src/lib/textMatching.ts`

- Normalize text (lowercase, remove punctuation)
- Implement Levenshtein distance calculation
- Calculate similarity percentage
- Threshold:  80% for passing

### 4. Conversation Bot State Machine

Location: `src/hooks/useConversationBot.ts`

States:
- `idle` - Waiting to start
- `ai_speaking` - AI is delivering its line
- `waiting_for_user` - User's turn to speak
- `processing` - Analyzing user's speech
- `success` - User passed, moving to next
- `retry` - User needs to try again
- `show_answer` - After 3 failed attempts
- `completed` - Conversation finished

### 5. Audio Recording & Merging

Location: `src/hooks/useAudioRecorder.ts`

- Record user's voice for each turn
- Store audio blobs in array
- Merge all recordings at the end
- Provide playback functionality

## Key Constants

```typescript
// src/lib/constants.ts
export const MATCHING_THRESHOLD = 80; // 80% similarity required
export const MAX_RETRY_ATTEMPTS = 3;  // 3 attempts before showing answer
export const SPEECH_LANG = 'en-US';   // English (US)
```

## Browser Compatibility

The Web Speech API is required.  Supported browsers:
- ✅ Chrome (Desktop & Android) - Recommended
- ✅ Edge
- ✅ Safari (partial support)
- ❌ Firefox (limited support)

Include a browser check and show a warning for unsupported browsers.

## Development Guidelines

### Code Style

- Use functional components with hooks
- Implement proper TypeScript types
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

### State Management

- Use React hooks (useState, useReducer) for local state
- Context API for shared state if needed
- No external state library required for MVP

### Error Handling

- Handle microphone permission denial
- Handle speech recognition errors
- Provide user-friendly error messages
- Implement fallback for unsupported browsers

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

Focus testing on:
- Text matching algorithm accuracy
- Conversation state transitions
- Component rendering

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

Recommended platforms:
- Vercel (optimized for Next.js)
- Netlify
- AWS Amplify

## Future Enhancements

- [ ] Backend API for more conversations
- [ ] User authentication & progress tracking
- [ ] Pronunciation scoring with detailed feedback
- [ ] Multiple language support
- [ ] Mobile app version
- [ ] Leaderboard and achievements