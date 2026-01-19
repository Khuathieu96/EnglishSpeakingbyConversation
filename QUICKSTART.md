# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, and Tailwind CSS.

### Step 2: Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Step 3: Open in Browser

Open **Google Chrome** or **Microsoft Edge** and navigate to:
```
http://localhost:3000
```

> ⚠️ **Important**: Use Chrome or Edge for the best experience. Safari has limited support, and Firefox is not recommended.

---

## 🎤 First Conversation

1. **Select a Conversation**
   - Click on "Restaurant Order" (Beginner level)

2. **Allow Microphone Access**
   - When prompted, click "Allow" to enable microphone

3. **Listen to AI**
   - The AI will speak the first line
   - Read the script hint that appears

4. **Speak Your Response**
   - Click the "🎤 Tap to Speak" button
   - Speak clearly into your microphone
   - Say the line shown on screen

5. **Get Feedback**
   - See your matching percentage
   - ≥80%: You pass! Move to next line
   - <80%: Try again (up to 3 attempts)

6. **Complete Conversation**
   - Finish all lines in the conversation
   - View your statistics
   - Listen to your full recording

---

## 🎯 Tips for Best Results

### Speaking Tips
- **Speak clearly** at a normal pace
- **Use proper pronunciation** 
- **Minimize background noise**
- **Hold microphone at proper distance** (not too close/far)

### Technical Tips
- Use a **good quality microphone** or headset
- Ensure **stable internet connection** (Web Speech API needs online)
- Close other tabs using microphone
- Grant microphone permission when prompted

### Scoring
- **95-100%**: Perfect! Excellent pronunciation
- **90-94%**: Great! Very close
- **80-89%**: Good! You passed
- **70-79%**: Almost there, try again
- **Below 70%**: Keep practicing

---

## 📂 Project Structure Overview

```
app/                    # Next.js pages
  ├── page.tsx         # Home (conversation list)
  └── chat/            # Chat page
components/            # React components
  ├── Chat/           # Chat interface
  ├── ConversationList/ # Conversation cards
  └── ui/             # Base UI components
hooks/                # Custom React hooks
  ├── useSpeechRecognition.ts
  ├── useSpeechSynthesis.ts
  ├── useAudioRecorder.ts
  └── useConversationBot.ts
lib/                  # Utilities
  ├── textMatching.ts  # Similarity algorithm
  ├── audioUtils.ts    # Audio processing
  └── constants.ts     # Configuration
data/                 # Static data
  └── conversations.ts # Conversation scripts
```

---

## 🔧 Common Issues & Solutions

### Issue: Microphone Not Working
**Solution:**
1. Check browser permissions (chrome://settings/content/microphone)
2. Ensure microphone is connected and working
3. Try reloading the page
4. Check if another app is using the microphone

### Issue: Speech Recognition Not Starting
**Solution:**
1. Make sure you're using Chrome or Edge
2. Check internet connection (Web Speech API requires online)
3. Look for errors in browser console (F12)

### Issue: Low Matching Scores
**Solution:**
1. Speak more clearly and slowly
2. Reduce background noise
3. Check microphone quality
4. Try moving closer/farther from microphone

### Issue: Audio Not Playing Back
**Solution:**
1. Check browser audio settings
2. Ensure speakers/headphones are working
3. Look for errors in browser console

---

## 📚 Available Conversations

### Beginner (Easy) 🌱
- **Restaurant Order** - Order food and drinks (5 min)
- **Meeting New People** - Introductions and small talk (4 min)
- **Shopping at the Store** - Retail shopping phrases (4 min)

### Intermediate (Medium) 🌿
- **At the Airport** - Airport navigation (6 min)
- **Doctor Visit** - Healthcare communication (5 min)
- **Hotel Check-in** - Hotel interactions (5 min)

### Advanced (Hard) 🌳
- **Job Interview** - Professional interview questions (8 min)
- **Business Negotiation** - Business terms and contracts (7 min)
- **Technical Support Call** - Troubleshooting communication (6 min)

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Push code to GitHub
2. Connect repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

---

## 📞 Need Help?

- Check [README.md](README.md) for detailed documentation
- Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for technical details
- Review [docs/requirement.md](docs/requirement.md) for requirements
- Review [docs/instruction.md](docs/instruction.md) for dev guide

---

**Happy Learning! 🎉**
