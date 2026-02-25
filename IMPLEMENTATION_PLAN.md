# Implementation Plan for Stitch Designs

## Screens Overview

Based on the 3 Stitch designs, we have:

1. **Conversation List** (`conversation_scenarios_list/code.html`) - ✅ MOSTLY DONE
2. **Interactive Chat** (`interactive_practice_chat/code.html`) - ⚠️ NEEDS UPDATE
3. **Summary Screen** (`practice_session_summary/code.html`) - ⚠️ NEEDS UPDATE

---

## Screen 1: Conversation List - ✅ Status: 90% Complete

### What's Already Done:
- ✅ Header with mic icon and profile button
- ✅ Filter buttons (All, Beginner, Intermediate, Advanced)
- ✅ Conversation cards with images
- ✅ Star difficulty indicators
- ✅ Category and time badges
- ✅ Bottom navigation bar

### What Needs to Be Fixed:
1. Ensure Material Symbols stars render with fill
2. Verify all colors match (primary teal #19a6b3)
3. Check backdrop blur on header

---

## Screen 2: Interactive Chat - ⚠️ Status: 60% Complete

### Current Components:
- `app/chat/[conversationId]/page.tsx` - Main chat page
- `components/Chat/ChatContainer.tsx` - Chat wrapper
- `components/Chat/MessageBubble.tsx` - Message display
- `components/Chat/VoiceRecorder.tsx` - Recording UI

### What Needs to Be Updated:

#### Header/Progress Bar:
```tsx
✅ Back button with arrow_back_ios_new icon
✅ "Practice Session" centered title
✅ More options button (more_horiz icon)
✅ Progress bar showing "2 / 10 Phrases"
✅ Conversation title in primary color
✅ Animated progress fill
```

#### Chat Messages:
```tsx
✅ AI messages: left-aligned, white background, rounded-bl-none
✅ User messages: right-aligned, primary background, rounded-br-none
✅ Avatar images (32px circular)
✅ Username labels (11px, bold, uppercase)
✅ Message text (15px, medium weight)
```

#### User Correction Display:
```tsx
🔄 Show "You said:" section with user's transcript
🔄 Show "Expected:" section with correct text
🔄 Highlight differences with bg-white/20
🔄 Border between sections: border-white/20
```

#### Target Phrase Box:
```tsx
🔄 "Your Turn" badge (absolute positioned, -top-3)
🔄 White card with border-2 border-primary
🔄 "Repeat this phrase" label (gray-400, xs, uppercase)
🔄 Large phrase text (2xl, bold)
🔄 "Listen to pronunciation" button with volume_up icon
```

#### Recording UI:
```tsx
✅ Large circular mic button (w-20 h-20)
🔄 Pulsing ring animation (red, opacity 0.6)
✅ "Listening..." text with animate-pulse
✅ "Attempts: X remaining" counter
```

---

## Screen 3: Summary Screen - ⚠️ Status: 40% Complete

### Current Components:
- `components/CompletionScreen/index.tsx` - Summary display

### What Needs to Be Added:

#### Header:
```tsx
🔄 Close button (X icon, top-left)
🔄 "Session Summary" centered title
```

#### Celebration Section:
```tsx
🔄 Celebration icon in primary/10 background (48px circular)
🔄 "Congratulations!" heading (32px, extrabold)
🔄 Personalized message: "Great job, Alex!"
```

#### Stats Grid (2x2):
```tsx
🔄 Lines stat: check_circle icon, "10/10"
🔄 Perfect stat: star icon, "7"
🔄 Retries stat: history icon, "5"
🔄 Match Score: Featured card with circular progress (87%)
  - Border-2 border-primary
  - SVG circular progress indicator
  - Background decoration (insights icon, opacity-5)
```

#### Audio Review Section:
```tsx
🔄 "Review your recording" heading
🔄 White card with play button (size-12, circular)
🔄 Session info: "#42", "2 mins 14 secs"
🔄 Waveform visualization:
  - Active bars: bg-primary
  - Inactive bars: bg-primary/10 (lighter)
  - Height variations (h-4 to h-12)
🔄 Time display: "0:45" / "2:14"
```

#### Motivational Banner:
```tsx
🔄 Background image with gradient overlay
🔄 "Keep the momentum going!" text
🔄 Min height: 140px, rounded-xl
```

#### Action Buttons:
```tsx
🔄 "Restart Session" button (primary, with refresh icon)
🔄 "Back to Dashboard" button (secondary, with dashboard icon)
🔄 Fixed bottom positioning with backdrop blur
```

---

## Priority Tasks

### High Priority (Core Functionality)
1. ✅ Fix Material Symbols star rendering
2. 🔄 Update chat message styling (correction display)
3. 🔄 Add target phrase box to chat
4. 🔄 Implement pulsing ring animation for recording
5. 🔄 Update CompletionScreen with new stats grid

### Medium Priority (Polish)
6. 🔄 Add circular progress indicator for match score
7. 🔄 Create waveform visualization component
8. 🔄 Add motivational banner to summary
9. 🔄 Update header progress bar styling

### Low Priority (Enhancement)
10. 🔄 Add smooth scroll animations
11. 🔄 Implement avatar image support
12. 🔄 Add haptic feedback for mobile
13. 🔄 Polish transition animations

---

## File Changes Required

### New Files to Create:
- ✅ `DESIGN_SYSTEM.md` - Complete design documentation
- 🔄 `components/Chat/TargetPhraseBox.tsx` - Phrase display component
- 🔄 `components/Chat/CorrectionDisplay.tsx` - User correction component
- 🔄 `components/Summary/StatsGrid.tsx` - Summary stats component
- 🔄 `components/Summary/AudioWaveform.tsx` - Waveform player
- 🔄 `components/Summary/CircularProgress.tsx` - SVG progress indicator

### Files to Update:
- 🔄 `app/chat/[conversationId]/page.tsx` - Add new header
- 🔄 `components/Chat/MessageBubble.tsx` - Add correction display
- 🔄 `components/Chat/VoiceRecorder.tsx` - Add pulsing animation
- 🔄 `components/CompletionScreen/index.tsx` - Complete redesign
- 🔄 `app/globals.css` - Add pulsing-ring animation

### Files Already Updated:
- ✅ `tailwind.config.ts` - Colors, fonts, border radius
- ✅ `app/layout.tsx` - Google Fonts, Material Symbols
- ✅ `app/page.tsx` - Header, bottom nav
- ✅ `components/ConversationList/ConversationCard.tsx` - Card design
- ✅ `components/ConversationList/index.tsx` - Filter buttons

---

## Next Steps

1. **Phase 1**: Update Chat Screen Components
   - Create TargetPhraseBox component
   - Update MessageBubble with correction display
   - Add pulsing animation CSS
   - Update chat header with progress bar

2. **Phase 2**: Redesign Summary Screen
   - Create new stats grid layout
   - Add circular progress indicator
   - Build waveform component
   - Add motivational banner

3. **Phase 3**: Testing & Polish
   - Test all transitions
   - Verify responsive design
   - Check dark mode styling
   - Validate accessibility

---

## Legend
- ✅ Complete
- 🔄 In Progress / Needs Work
- ⚠️ Not Started
