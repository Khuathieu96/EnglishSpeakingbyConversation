# English Speaking Practice Web App - Requirements Document

## 1. Project Overview

### 1.1 Purpose
A web application that helps users practice English speaking through interactive, AI-guided conversations. Users engage in scripted dialogues where an AI bot evaluates their spoken responses and provides real-time feedback. 

### 1.2 Target Users
- English language learners (ESL/EFL)
- Students preparing for English proficiency tests
- Professionals improving business English
- Anyone wanting to practice conversational English

### 1.3 Key Value Proposition
- Practice speaking without a human partner
- Immediate feedback on pronunciation accuracy
- Structured learning through scripted conversations
- Ability to review and listen to recorded practice sessions

---

## 2. Functional Requirements

### 2.1 Conversation List Screen (Home Page)

| ID | Requirement | Priority |
|----|-------------|----------|
| F2. 1.1 | Display a list/grid of available conversation scenarios | High |
| F2.1.2 | Show conversation title, description, and difficulty level | High |
| F2.1.3 | Display category/topic for each conversation | Medium |
| F2.1.4 | Show thumbnail or icon for visual identification | Medium |
| F2.1.5 | Allow filtering by difficulty (beginner/intermediate/advanced) | Low |
| F2.1.6 | Allow filtering by category | Low |
| F2.1.7 | Navigate to chat screen when conversation is selected | High |

### 2.2 Chat Screen

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.2.1 | Display conversation title and progress indicator | High |
| F2.2.2 | Show chat messages in bubble format (AI left, User right) | High |
| F2.2.3 | Distinguish AI messages from user messages visually | High |
| F2.2.4 | Display the expected script line for user reference | Medium |
| F2.2.5 | Show microphone button for voice recording | High |
| F2.2.6 | Display recording status (idle, recording, processing) | High |
| F2.2.7 | Show matching result percentage after user speaks | High |
| F2.2.8 | Display retry count (attempts remaining) | High |
| F2.2.9 | Auto-scroll to latest message | Medium |
| F2.2.10 | Show "Back to List" navigation | High |
| F2.2.11 | Display visual recording indicator when listening | High |
| F2.2.12 | Show user's actual transcript vs expected text comparison | High |
| F2.2.13 | Keep wrong answers visible in conversation history | High |
| F2.2.14 | Provide Skip button to bypass difficult lines | Medium |
| F2.2.15 | Show Stop button during active recording | High |
| F2.2.16 | Display AI text immediately when AI starts speaking | High |

### 2.3 AI Bot - Speech Detection & Validation

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.3.1 | AI speaks first line when conversation starts | High |
| F2.3.2 | Use Text-to-Speech to vocalize AI lines | High |
| F2.3.3 | Detect and transcribe user's spoken voice | High |
| F2.3.4 | Calculate matching rate between user speech and script | High |
| F2.3.5 | Pass user if matching rate >= 80% | High |
| F2.3.6 | Prompt retry if matching rate < 80% | High |
| F2.3.7 | Allow maximum 3 retry attempts per line | High |
| F2.3.8 | Show correct answer after 3 failed attempts | High |
| F2.3.9 | Automatically continue to next line after success/show answer | High |
| F2.3.10 | Provide encouraging feedback messages | Medium |
| F2.3.11 | Auto-stop recording after 5 seconds of listening | High |
| F2.3.12 | Process interim speech results when Stop is clicked | High |
| F2.3.13 | Display pulsing microphone animation during recording | High |
| F2.3.14 | Show user transcript in message bubble after speaking | High |
| F2.3.15 | Persist wrong answers in conversation history | High |

### 2.4 Voice Recording & Playback

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.4.1 | Record user's voice during speaking | High |
| F2.4.2 | Store each voice recording segment | High |
| F2.4.3 | Merge all user voice recordings at conversation end | High |
| F2.4.4 | Provide audio player to listen to complete recording | High |
| F2.4.5 | Allow download of merged audio file | Low |

### 2.5 Conversation Completion

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.5.1 | Detect when all lines are completed | High |
| F2.5.2 | Display completion summary screen | High |
| F2.5.3 | Show overall statistics (lines passed, retries used) | Medium |
| F2.5.4 | Provide merged audio playback | High |
| F2.5.5 | Option to restart conversation | Medium |
| F2.5.6 | Option to return to conversation list | High |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NF3.1.1 | Page load time | < 2 seconds |
| NF3.1.2 | Speech recognition response time | < 1 second |
| NF3.1.2a | Speech recognition auto-stop timeout | 5 seconds |
| NF3.1.2b | Stop button speech processing time | Immediate |
| NF3.1.3 | Text matching calculation | < 100ms |
| NF3.1.4 | Audio merge processing | < 5 seconds |

### 3.2 Usability

| ID | Requirement |
|----|-------------|
| NF3.2.1 | Intuitive UI requiring no tutorial |
| NF3.2.2 | Clear visual feedback for all actions |
| NF3.2.3 | Accessible color contrast (WCAG AA) |
| NF3.2.4 | Mobile-responsive design |
| NF3.2.5 | Clear error messages with recovery instructions |

### 3.3 Compatibility

| ID | Requirement |
|----|-------------|
| NF3.3.1 | Support Chrome browser (primary) |
| NF3.3.2 | Support Edge browser |
| NF3.3.3 | Support Safari browser (best effort) |
| NF3.3.4 | Display warning for unsupported browsers |
| NF3.3.5 | Work on desktop and mobile devices |

### 3.4 Security

| ID | Requirement |
|----|-------------|
| NF3.4.1 | Request microphone permission explicitly |
| NF3.4.2 | No audio data sent to external servers (client-side only) |
| NF3.4.3 | Clear audio data when leaving conversation |

---

## 4. User Interface Requirements

### 4.0 Visual Recording Indicator

**Design Requirements:**
- Display centered above control buttons when recording active
- Animated pulsing microphone icon (🎤) in red circular badge
- Two expanding pulse rings with opacity animation
- "🔴 Recording..." text with pulse effect
- Helper text: "Speak clearly into your microphone"
- Only visible when `isRecording` or `isListening` is true

### 4.0.1 Transcript Comparison Display

**Message Bubble Requirements:**
- User message bubbles show two-part display:
  - "You said:" - User's actual transcript (bold, full size)
  - "Expected:" - Correct script (smaller, italic, semi-transparent)
  - Divider line between sections
- Comparison only shows for completed attempts (not current)
- Remains visible throughout conversation
- Red background for failed attempts (<80%)
- Green background for successful attempts (≥80%)

### 4.0.2 Control Button Requirements

**Button States:**
- "Tap to Speak" - Primary button, enabled when waiting
- "Stop" - Red danger button, appears during recording
- "Skip" - Secondary button, appears when not recording
- Buttons arranged in flex row with gap-3
- Main button takes flex-1 for prominence

## 4.1. User Interface Requirements (Original)

### 4.1 Conversation List Screen Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  🎤 English Speaking Practice                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Choose a conversation to practice:                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  🍽️             │  │  ✈️             │                  │
│  │  Restaurant     │  │  At the Airport │                  │
│  │  Order          │  │                 │                  │
│  │  ─────────────  │  │  ─────────────  │                  │
│  │  Practice       │  │  Navigate       │                  │
│  │  ordering food  │  │  airport        │                  │
│  │  at restaurant  │  │  situations     │                  │
│  │                 │  │                 │                  │
│  │  ⭐ Beginner    │  │  ⭐⭐ Inter.     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  💼             │  │  🏥             │                  │
│  │  Job Interview  │  │  Doctor Visit   │                  │
│  │  ...             │  │  ...            │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Chat Screen Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back    Restaurant Order           Progress:  2/10        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─���───────────────────────────┐                           │
│  │ 🤖 Hello! Welcome to our    │                           │
│  │    restaurant.  How many     │                           │
│  │    people?                   │                           │
│  └─────────────────────────────┘                           │
│                                                             │
│                    ┌─────────────────────────────┐          │
│                    │ Hi, table for two please.   👤│         │
│                    │                             │          │
│                    │ ✅ Match:  92%               │          │
│                    └─────────────────────────────┘          │
│                                                             │
│  ┌─────────────────────────────┐                           │
│  │ 🤖 Right this way.  Here     │                           │
│  │    are your menus. Can I    │                           │
│  │    get you something to     │                           │
│  │    drink?                   │                           │
│  └─────────────────────────────┘                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📝 Your line:  "I'll have water, please."            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              🎤 Tap to Speak                        │   │
│  │                                                     │   │
│  │              Attempts: 3 remaining                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Completion Screen Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    🎉 Congratulations!                      │
│                                                             │
│              You completed "Restaurant Order"               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   Lines Completed: 10/10                            │   │
│  │   Perfect Lines: 7                                  │   │
│  │   Retries Used: 5                                   │   │
│  │   Average Match: 87%                                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   🔊 Listen to Your Recording                       │   │
│  │   ▶️ ━━━━━━━━━━━━━━━━━━━━━━━━━ 0:00 / 1:32          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│         ┌──────────────┐    ┌──────────────┐               │
│         │  🔄 Restart  │    │  📋 Back to  │               │
│         │              │    │     List     │               │
│         └──────────────┘    └──────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Data Requirements

### 5.1 Conversation Data Structure

```typescript
interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty:  'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: number; // in minutes
  lines: ConversationLine[];
}

interface ConversationLine {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string; // Optional hint for difficult lines
}
```

### 5.2 Sample Conversations Required

| Category | Conversation | Difficulty | Lines |
|----------|--------------|------------|-------|
| Dining | Restaurant Order | Beginner | 10-12 |
| Travel | At the Airport | Intermediate | 12-15 |
| Professional | Job Interview | Advanced | 15-20 |
| Healthcare | Doctor Visit | Intermediate | 10-12 |
| Shopping | At the Store | Beginner | 8-10 |
| Social | Meeting New People | Beginner | 8-10 |

---

## 6. Technical Specifications

### 6.1 Speech Recognition Configuration

```typescript
const recognitionConfig = {
  lang: 'en-US',
  continuous: false,
  interimResults: true,
  maxAlternatives: 3,
};
```

### 6.2 Text Matching Algorithm

**Algorithm**:  Levenshtein Distance with normalization

**Preprocessing**:
1. Convert to lowercase
2. Remove punctuation
3. Trim whitespace
4. Normalize multiple spaces

**Matching Formula**:
```
similarity = ((maxLength - levenshteinDistance) / maxLength) * 100
```

**Pass Threshold**: >= 80%

### 6.3 Audio Recording Specifications

| Property | Value |
|----------|-------|
| Format | WebM/Opus or WAV |
| Sample Rate | 44100 Hz |
| Channels | Mono |
| Bit Depth | 16-bit |

---

## 7. Acceptance Criteria

### 7.1 Conversation List Screen
- [ ] All conversations are displayed with correct information
- [ ] Clicking a conversation navigates to chat screen
- [ ] UI is responsive on mobile and desktop

### 7.2 Chat Screen
- [ ] AI speaks first line automatically on load
- [ ] User can record voice by clicking microphone button
- [ ] Voice is transcribed and compared to script
- [ ] Matching percentage is displayed after each attempt
- [ ] User can retry up to 3 times if below 80%
- [ ] Correct answer is shown after 3 failed attempts
- [ ] Conversation progresses automatically after success

### 7.3 Completion
- [ ] Completion screen displays after last line
- [ ] All user recordings are merged into single audio
- [ ] User can play back their complete recording
- [ ] User can return to conversation list

---

## 8. Future Considerations (Out of Scope for MVP)

- User authentication and progress persistence
- Backend API for dynamic conversation content
- Pronunciation scoring with phoneme analysis
- Spaced repetition for difficult phrases
- Multiplayer conversation practice
- Integration with language learning platforms
- Mobile native applications (iOS/Android)
- Offline mode support
- Multiple accent support (British, Australian, etc.)

---

## 9. Glossary

| Term | Definition |
|------|------------|
| STT | Speech-to-Text - Converting spoken audio to written text |
| TTS | Text-to-Speech - Converting written text to spoken audio |
| Matching Rate | Percentage similarity between user's speech and expected script |
| Web Speech API | Browser API for speech recognition and synthesis |
| Levenshtein Distance | Algorithm measuring difference between two strings |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | - | Initial requirements document |