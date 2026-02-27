import * as fs from 'fs';
import * as path from 'path';
import { conversations } from '../data/conversations';

type Palette = {
  backgroundA: string;
  backgroundB: string;
  accent: string;
  text: string;
  chipBg: string;
  chipText: string;
};

const difficultyPalette: Record<'beginner' | 'intermediate' | 'advanced', Palette> = {
  beginner: {
    backgroundA: '#fc6c02',
    backgroundB: '#ff9a52',
    accent: '#144491',
    text: '#0b132b',
    chipBg: '#fff1e6',
    chipText: '#144491',
  },
  intermediate: {
    backgroundA: '#144491',
    backgroundB: '#3f88c5',
    accent: '#0a3c66',
    text: '#0b132b',
    chipBg: '#e8f1fb',
    chipText: '#144491',
  },
  advanced: {
    backgroundA: '#0c3f6d',
    backgroundB: '#144491',
    accent: '#082b49',
    text: '#f8fafc',
    chipBg: '#0d4e86',
    chipText: '#f1f5f9',
  },
};

const categoryIcon: Record<string, string> = {
  Social: '💬',
  Lifestyle: '🎯',
  Dining: '🍽️',
  Travel: '✈️',
  'Daily Life': '🚶',
  Home: '🏠',
  Health: '🩺',
  Career: '💼',
  General: '🌟',
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toTitleLines(title: string): [string, string] {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length <= 2) {
    return [title, ''];
  }
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function buildSvg(params: {
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}): string {
  const { title, category, difficulty } = params;
  const palette = difficultyPalette[difficulty];
  const icon = categoryIcon[category] || categoryIcon.General;
  const [line1, line2] = toTitleLines(title);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.backgroundA}"/>
      <stop offset="100%" stop-color="${palette.backgroundB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="20%" r="45%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.42)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>

  <circle cx="170" cy="130" r="90" fill="rgba(255,255,255,0.18)"/>
  <circle cx="1080" cy="550" r="160" fill="rgba(255,255,255,0.14)"/>
  <rect x="70" y="90" width="1060" height="495" rx="30" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.25)"/>

  <rect x="110" y="125" width="210" height="52" rx="26" fill="${palette.chipBg}"/>
  <text x="215" y="159" text-anchor="middle" fill="${palette.chipText}" font-size="24" font-weight="700" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(category.toUpperCase())}</text>

  <text x="110" y="265" fill="${palette.text}" font-size="86" font-weight="800" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(line1)}</text>
  ${line2 ? `<text x="110" y="350" fill="${palette.text}" font-size="86" font-weight="800" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(line2)}</text>` : ''}

  <text x="110" y="455" fill="${palette.text}" font-size="38" font-weight="500" opacity="0.88" font-family="Inter, Segoe UI, Arial, sans-serif">Speaking Practice Conversation</text>

  <text x="1030" y="165" text-anchor="end" fill="${palette.text}" font-size="96" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${icon}</text>

  <rect x="930" y="510" width="190" height="52" rx="26" fill="${palette.accent}"/>
  <text x="1025" y="544" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="700" font-family="Inter, Segoe UI, Arial, sans-serif">${escapeXml(difficulty.toUpperCase())}</text>
</svg>`;
}

function run() {
  const outputDir = path.resolve(process.cwd(), 'public', 'conversations');
  fs.mkdirSync(outputDir, { recursive: true });

  let written = 0;

  for (const conversation of conversations) {
    const svg = buildSvg({
      title: conversation.title,
      category: conversation.category,
      difficulty: conversation.difficulty,
    });

    const outputPath = path.join(outputDir, `${conversation.id}.svg`);
    fs.writeFileSync(outputPath, svg, 'utf8');
    written += 1;
  }

  console.log(`Generated ${written} illustration(s) in ${outputDir}`);
}

run();
