# Design System Documentation

## Overview
This document defines the complete design system for the English Speaking Practice app based on the Stitch designs.

## Color Palette

### Primary Colors
- **Primary**: `#19a6b3` (Teal/Cyan) - Main brand color
- **Background Light**: `#f0f2f4` - Light mode background
- **Background Dark**: `#22252a` - Dark mode background

### Text Colors
- **Light Mode Text**: `#0e191b` - Primary text
- **Dark Mode Text**: `#f8fbfb` / `white` - Primary text
- **Muted Text Light**: `opacity-70` on primary text
- **Muted Text Dark**: `opacity-70` on white

### Status Colors
- **Success/Star**: `#f59e0b` (yellow-500)
- **Error/Warning**: `#ef4444` (red-500)

## Typography

### Font Family
- **Primary**: Manrope (Google Font)
- **Weights**: 400, 500, 600, 700, 800

### Text Styles

#### Headers
- **Page Title**: `text-2xl font-extrabold` (32px, 800 weight)
- **Section Title**: `text-lg font-bold tracking-[-0.015em]` (18px, 700 weight)
- **Card Title**: `text-base font-bold` (16px, 700 weight)

#### Body Text
- **Primary**: `text-[15px] font-medium leading-relaxed`
- **Small**: `text-sm font-medium` (14px)
- **Extra Small**: `text-xs` (12px)

#### Labels
- **Category/Tag**: `text-[10px] font-bold uppercase tracking-widest`
- **Badge**: `text-[11px] font-semibold`

## Spacing & Layout

### Container
- **Max Width**: `max-w-md` (448px) centered on screen
- **Padding**: `px-4` (16px horizontal) standard page padding

### Card Spacing
- **Gap Between Cards**: `gap-4` (16px)
- **Card Padding**: `p-4` or `p-5` (16px or 20px)
- **Section Spacing**: `py-6` (24px vertical)

## Components

### 1. Header (Top Navigation)

#### Standard Header
```html
<header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
  <div class="flex items-center p-4 pb-3 justify-between max-w-md mx-auto w-full">
    <!-- Logo Section -->
    <div class="flex items-center gap-3">
      <div class="bg-primary text-white p-2 rounded-lg shadow-lg shadow-primary/20">
        <span class="material-symbols-outlined">mic</span>
      </div>
      <h2 class="text-xl font-bold">Practice English</h2>
    </div>
    <!-- Profile Button -->
    <button class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <span class="material-symbols-outlined">account_circle</span>
    </button>
  </div>
</header>
```

#### Chat Header (with Progress)
```html
<header class="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
  <!-- Title Bar -->
  <div class="flex items-center p-4 pb-2 justify-between">
    <div class="text-primary size-10 flex items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer">
      <span class="material-symbols-outlined">arrow_back_ios_new</span>
    </div>
    <h2 class="text-lg font-bold flex-1 text-center">Practice Session</h2>
    <div class="size-10 flex items-center justify-center text-primary">
      <span class="material-symbols-outlined">more_horiz</span>
    </div>
  </div>
  <!-- Progress Bar -->
  <div class="flex flex-col gap-2 px-6 py-2">
    <div class="flex gap-6 justify-between items-end">
      <p class="text-sm font-semibold text-primary uppercase tracking-wider">At the Restaurant</p>
      <p class="text-xs font-medium opacity-70">2 / 10 Phrases</p>
    </div>
    <div class="h-1.5 w-full rounded-full bg-primary/20">
      <div class="h-1.5 rounded-full bg-primary" style="width: 20%;"></div>
    </div>
  </div>
</header>
```

### 2. Conversation Cards

```html
<div class="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all cursor-pointer">
  <!-- Image with Difficulty Badge -->
  <div class="relative h-44 w-full bg-cover bg-center" style="background-image: url('...')">
    <div class="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
      <span class="material-symbols-outlined text-yellow-500 text-xs fill-1" style="font-size: 14px; font-variation-settings: 'FILL' 1;">star</span>
      <span class="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Beginner</span>
    </div>
  </div>
  <!-- Card Content -->
  <div class="p-4">
    <!-- Category & Time -->
    <div class="flex items-center justify-between mb-1">
      <span class="text-[10px] font-bold uppercase tracking-widest text-primary">Dining</span>
      <div class="flex items-center gap-1 text-gray-400">
        <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
        <span class="text-[11px] font-semibold">5m</span>
      </div>
    </div>
    <!-- Title -->
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-1">Restaurant Order</h4>
    <!-- Description -->
    <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Practice ordering food...</p>
  </div>
</div>
```

### 3. Chat Messages

#### AI Message
```html
<div class="flex items-end gap-3 max-w-[85%]">
  <!-- Avatar -->
  <div class="bg-primary/10 aspect-square rounded-full w-8 shrink-0 flex items-center justify-center border border-primary/20 overflow-hidden">
    <img class="w-full h-full object-cover" src="..." alt="AI Tutor"/>
  </div>
  <!-- Message -->
  <div class="flex flex-col gap-1 items-start">
    <p class="text-primary text-[11px] font-bold uppercase tracking-tight ml-2">AI Tutor</p>
    <div class="text-[15px] font-medium leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm text-[#0e191b] dark:text-gray-100">
      Message content here
    </div>
  </div>
</div>
```

#### User Message with Correction
```html
<div class="flex items-end gap-3 justify-end ml-auto max-w-[85%]">
  <div class="flex flex-col gap-1 items-end">
    <p class="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-tight mr-2">You</p>
    <div class="rounded-2xl rounded-br-none px-4 py-3 bg-primary text-white shadow-md">
      <!-- What user said -->
      <div class="text-[15px] font-medium border-b border-white/20 pb-2 mb-2">
        <span class="opacity-70 text-xs block mb-0.5">You said:</span>
        I have water please
      </div>
      <!-- Expected text -->
      <div class="text-[15px] font-medium">
        <span class="opacity-70 text-xs block mb-0.5">Expected:</span>
        I'll <span class="bg-white/20 px-1 rounded">have</span> water, please
      </div>
    </div>
  </div>
  <!-- User Avatar -->
  <div class="bg-gray-300 dark:bg-gray-600 aspect-square rounded-full w-8 shrink-0 overflow-hidden">
    <img class="w-full h-full object-cover" src="..." alt="User"/>
  </div>
</div>
```

### 4. Recording Interface

#### Target Phrase Box
```html
<div class="w-full mb-8 relative">
  <!-- Badge -->
  <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest z-10">
    Your Turn
  </div>
  <!-- Box -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border-2 border-primary shadow-xl ring-4 ring-primary/5">
    <h4 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Repeat this phrase</h4>
    <p class="text-2xl font-bold text-[#0e191b] dark:text-white">"I'll have water, please"</p>
    <button class="mt-4 inline-flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80">
      <span class="material-symbols-outlined text-base">volume_up</span>
      Listen to pronunciation
    </button>
  </div>
</div>
```

#### Microphone Button (Recording)
```html
<div class="flex flex-col items-center gap-4">
  <!-- Pulsing Mic Button -->
  <div class="relative group cursor-pointer">
    <div class="pulsing-ring rounded-full">
      <div class="bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-4xl">mic</span>
      </div>
    </div>
  </div>
  <!-- Status Text -->
  <div class="flex flex-col items-center gap-1">
    <p class="text-primary font-bold animate-pulse text-sm">Listening...</p>
    <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">Attempts: 3 remaining</p>
  </div>
</div>

<!-- CSS for pulsing ring -->
<style>
.pulsing-ring {
  position: relative;
}
.pulsing-ring::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid #ef4444;
  border-radius: 9999px;
  opacity: 0.6;
  animation: pulse 1.5s infinite;
}
</style>
```

### 5. Summary Stats Grid

```html
<div class="grid grid-cols-2 gap-4 p-4">
  <!-- Standard Stat -->
  <div class="flex flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-[#2d3139] shadow-sm">
    <div class="flex items-center gap-2 mb-1">
      <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
      <p class="text-[#0e191b]/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider">Lines</p>
    </div>
    <p class="text-[#0e191b] dark:text-white text-2xl font-bold">10/10</p>
  </div>
  
  <!-- Featured Stat (Match Score) -->
  <div class="flex flex-col items-center justify-center gap-1 rounded-xl p-5 border-2 border-primary bg-white dark:bg-[#2d3139] shadow-md relative overflow-hidden">
    <div class="absolute -right-2 -bottom-2 opacity-5">
      <span class="material-symbols-outlined text-8xl">insights</span>
    </div>
    <p class="text-primary text-xs font-black uppercase tracking-widest mb-1 z-10">Match Score</p>
    <div class="relative flex items-center justify-center z-10">
      <!-- Circular Progress SVG -->
      <svg class="w-16 h-16 transform -rotate-90">
        <circle class="text-primary/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="6"/>
        <circle class="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-dasharray="175.9" stroke-dashoffset="22.8" stroke-width="6"/>
      </svg>
      <span class="absolute text-lg font-black">87%</span>
    </div>
  </div>
</div>
```

### 6. Audio Waveform Player

```html
<div class="bg-white dark:bg-[#2d3139] rounded-xl p-5 shadow-sm border border-black/5 dark:border-white/5">
  <!-- Player Controls -->
  <div class="flex items-center gap-4 mb-4">
    <button class="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
      <span class="material-symbols-outlined text-3xl">play_arrow</span>
    </button>
    <div class="flex-1">
      <p class="text-sm font-bold">Practice Session #42</p>
      <p class="text-xs opacity-50">2 mins 14 secs • English Conversation</p>
    </div>
  </div>
  
  <!-- Waveform -->
  <div class="flex items-end justify-between h-12 w-full px-1">
    <div class="waveform-bar h-4"></div>
    <div class="waveform-bar h-6"></div>
    <!-- More bars... -->
  </div>
  
  <!-- Time Display -->
  <div class="flex justify-between mt-2">
    <span class="text-[10px] font-bold text-primary">0:45</span>
    <span class="text-[10px] font-bold opacity-40">2:14</span>
  </div>
</div>

<!-- CSS -->
<style>
.waveform-bar {
  width: 3px;
  background-color: #19a6b3;
  border-radius: 2px;
  margin: 0 1px;
}
.waveform-bar.inactive {
  background-color: #d1e4e6;
}
</style>
```

### 7. Filter Buttons

```html
<div class="flex gap-2 overflow-x-auto no-scrollbar pb-4">
  <!-- Active Button -->
  <button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-6 text-white shadow-md shadow-primary/20">
    <span class="text-sm font-semibold">All</span>
  </button>
  <!-- Inactive Button -->
  <button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 transition-all active:scale-95">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Beginner</span>
  </button>
</div>
```

### 8. Bottom Navigation

```html
<nav class="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center max-w-md mx-auto rounded-t-3xl shadow-2xl">
  <!-- Active Tab -->
  <a class="flex flex-col items-center gap-1" href="#">
    <div class="text-primary flex h-8 items-center justify-center">
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
    </div>
    <p class="text-[10px] font-bold text-primary uppercase tracking-tighter">Home</p>
  </a>
  <!-- Inactive Tab -->
  <a class="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500" href="#">
    <div class="flex h-8 items-center justify-center">
      <span class="material-symbols-outlined">analytics</span>
    </div>
    <p class="text-[10px] font-bold uppercase tracking-tighter">Progress</p>
  </a>
</nav>
```

### 9. Primary Buttons

```html
<!-- Primary Action -->
<button class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
  <span class="material-symbols-outlined">refresh</span>
  Restart Session
</button>

<!-- Secondary Action -->
<button class="w-full bg-white dark:bg-[#2d3139] text-[#0e191b] dark:text-white font-bold py-4 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-center gap-2 transition-transform active:scale-95">
  <span class="material-symbols-outlined">dashboard</span>
  Back to Dashboard
</button>
```

## Border Radius Scale
- **Default**: `0.5rem` (8px)
- **Large**: `1rem` (16px) 
- **Extra Large**: `1.5rem` (24px)
- **Full**: `9999px` (Fully rounded)

## Shadows
- **Small**: `shadow-sm`
- **Medium**: `shadow-md`
- **Large**: `shadow-lg`
- **Extra Large**: `shadow-xl` with `shadow-primary/20`
- **2XL**: `shadow-2xl`

## Animation & Transitions
- **Backdrop Blur**: Always use `backdrop-blur-md` with semi-transparent backgrounds
- **Active State**: `active:scale-95` for buttons
- **Hover State**: `hover:opacity-80` or `hover:bg-primary/90`
- **Pulse Animation**: `animate-pulse` for recording indicators
- **Transition**: `transition-all` or `transition-transform` for smooth interactions

## Icons (Material Symbols)
Always use Material Symbols Outlined from Google Fonts:
- Default: `font-variation-settings: 'FILL' 0`
- Filled: `font-variation-settings: 'FILL' 1` (for active states)
- Common icons: `mic`, `arrow_back_ios_new`, `home`, `analytics`, `settings`, `play_arrow`, `volume_up`, `celebration`, `check_circle`, `star`

## Responsive Considerations
- Mobile-first design
- Max width container: `max-w-md mx-auto` (centered, 448px max)
- Horizontal scroll for filters with `overflow-x-auto no-scrollbar`
- Bottom padding for content: `pb-32` to account for fixed bottom nav
