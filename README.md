# English Speaking Practice Web App

An interactive web application for practicing English speaking through AI-guided conversations. Users speak scripted dialogues, and the app evaluates pronunciation accuracy in real-time using browser Web Speech APIs.

## Features

- ✅ **AI-Guided Conversations**: Practice with scripted dialogues across various scenarios
- 🎤 **Real-Time Speech Recognition**: Your voice is transcribed using Web Speech API
- 📊 **Instant Feedback**: Get immediate feedback on pronunciation accuracy (80% threshold)
- 🔄 **Retry System**: Up to 3 attempts per line before showing the correct answer
- 🎧 **Audio Playback**: Record and replay your entire conversation
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **Client-Side Only**: No backend required - all processing happens in your browser

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech Synthesis API
- **Audio Processing**: Web Audio API

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | ✅ Full | **Recommended** - Best experience |
| **Edge** | ✅ Full | Fully supported |
| **Safari** | ⚠️ Partial | Some features may be limited |
| **Firefox** | ❌ Limited | Web Speech API not fully supported |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Modern browser (Chrome or Edge recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd en-speaking-conversation
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page (conversation list)
│   ├── chat/[conversationId]/    # Chat page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ConversationList/         # Conversation selection
│   ├── Chat/                     # Chat interface
│   ├── AudioPlayer/              # Audio playback
│   ├── CompletionScreen/         # Results screen
│   ├── ui/                       # Base UI components
│   └── BrowserWarning.tsx        # Browser compatibility warning
├── hooks/                        # Custom React hooks
│   ├── useSpeechRecognition.ts   # Speech-to-text
│   ├── useSpeechSynthesis.ts     # Text-to-speech
│   ├── useAudioRecorder.ts       # Audio recording
│   └── useConversationBot.ts     # Main conversation logic
├── lib/                          # Utilities
│   ├── textMatching.ts           # Levenshtein distance algorithm
│   ├── audioUtils.ts             # Audio processing
│   └── constants.ts              # App constants
├── data/                         # Static data
│   └── conversations.ts          # Conversation scripts
└── types/                        # TypeScript types
    └── index.ts                  # Type definitions
```

## How It Works

### Conversation Flow

1. **Select Conversation**: Choose from various scenarios (beginner to advanced)
2. **AI Speaks First**: The AI bot introduces the conversation
3. **Your Turn**: Speak the displayed line into your microphone
4. **Text Matching**: Your speech is transcribed and compared to the expected text
5. **Feedback**: 
   - ≥80% similarity: Move to next line ✅
   - <80% similarity: Retry (up to 3 attempts) 🔄
   - After 3 attempts: Show correct answer and continue 💡
6. **Completion**: View statistics and replay your recording

### Text Matching Algorithm

Uses **Levenshtein Distance** to calculate similarity:
- Normalizes text (lowercase, removes punctuation)
- Calculates edit distance
- Returns similarity percentage
- **Pass threshold**: 80%

### State Machine

```
idle → ai_speaking → waiting_for_user → processing →
  → success (≥80%) → next line
  → retry (<80%, attempts < 3) → waiting_for_user
  → show_answer (attempts = 3) → next line
→ completed (all lines done)
```

## Available Conversations

### Beginner Level
- 🍽️ **Restaurant Order** - Practice ordering food and drinks
- 👋 **Meeting New People** - Learn introductions and small talk
- 🛒 **Shopping at the Store** - Common retail phrases

### Intermediate Level
- ✈️ **At the Airport** - Navigate airport situations
- 🏥 **Doctor Visit** - Describe symptoms and communicate with healthcare
- 🏨 **Hotel Check-in** - Practice hotel-related conversations

### Advanced Level
- 💼 **Job Interview** - Answer professional interview questions
- 🤝 **Business Negotiation** - Practice negotiating terms and contracts
- 🔧 **Technical Support Call** - Explain technical issues

## Configuration

Key constants in `lib/constants.ts`:

```typescript
MATCHING_THRESHOLD = 80;       // 80% similarity required
MAX_RETRY_ATTEMPTS = 3;        // 3 attempts before showing answer
SPEECH_LANG = 'en-US';         // English (US)
SPEECH_RATE = 0.9;             // Slightly slower for clarity
```

## Development

### Adding New Conversations

Edit `data/conversations.ts`:

```typescript
{
  id: 'my-conversation',
  title: 'My Conversation',
  description: 'Practice...',
  difficulty: 'beginner',
  category: 'Social',
  thumbnail: '👋',
  estimatedTime: 5,
  lines: [
    { id: 'line-1', speaker: 'ai', text: 'AI speaks first' },
    { id: 'line-2', speaker: 'user', text: 'User responds', hint: 'Optional hint' },
    // ... more lines
  ]
}
```

### Testing

```bash
npm run test              # Run tests
npm run test:coverage     # With coverage
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

- Netlify
- AWS Amplify
- Any static hosting

## Troubleshooting

### Microphone Permission Denied

1. Check browser settings
2. Ensure HTTPS (required for getUserMedia)
3. Allow microphone access when prompted

### Speech Recognition Not Working

1. Use Chrome or Edge browser
2. Check internet connection (Web Speech API requires online)
3. Speak clearly and at normal speed

### Audio Not Recording

1. Check microphone is connected and working
2. Verify browser supports MediaRecorder API
3. Check browser console for errors

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Acknowledgments

- Web Speech API for speech recognition and synthesis
- Next.js team for the excellent framework
- Tailwind CSS for styling utilities

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for English learners worldwide**
