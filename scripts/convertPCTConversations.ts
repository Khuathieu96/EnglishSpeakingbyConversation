/**
 * Script: Convert PCT_TAI_LIEU_GIAO_TIEP.md conversations to conversations.ts format
 *
 * This script:
 * 1. Reads the markdown file
 * 2. Extracts conversations under each "1.2. Hội thoại:" section
 * 3. Converts them into the Conversation[] format used by conversations.ts
 *
 * Usage: npx tsx scripts/convertPCTConversations.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Types (mirroring conversations.ts) ──────────────────────────────────────

interface ConversationLine {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string;
}

interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  estimatedTime: number;
  lines: ConversationLine[];
}

// ─── Metadata lookup per topic ───────────────────────────────────────────────

interface TopicMeta {
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

const topicMetadata: Record<string, TopicMeta> = {
  'SELF-INTRODUCTION': {
    description: 'Practice introducing yourself, sharing personal details, and making a great first impression.',
    difficulty: 'beginner',
    category: 'Social',
  },
  'HOBBIES': {
    description: 'Talk about your favorite hobbies, leisure activities, and how you spend your free time.',
    difficulty: 'beginner',
    category: 'Lifestyle',
  },
  'FOOD & DRINK': {
    description: 'Discuss your favorite foods, cooking methods, and dining preferences with a friend.',
    difficulty: 'beginner',
    category: 'Dining',
  },
  'DESCRIBE PEOPLE - APPEARANCE': {
    description: 'Learn to describe how people look, their physical features, and personal style.',
    difficulty: 'beginner',
    category: 'Social',
  },
  'EMOTIONS & CHARACTERISTIC': {
    description: 'Express feelings, describe personality traits, and talk about emotional experiences.',
    difficulty: 'intermediate',
    category: 'Social',
  },
  'MY HOMETOWN': {
    description: 'Share details about your hometown, its special features, and why you love it.',
    difficulty: 'intermediate',
    category: 'Travel',
  },
  'TRANSPORT': {
    description: 'Discuss transportation methods, daily commutes, and traffic experiences in your city.',
    difficulty: 'intermediate',
    category: 'Daily Life',
  },
  'TRAVELING': {
    description: 'Talk about memorable trips, travel experiences, and vacation planning.',
    difficulty: 'intermediate',
    category: 'Travel',
  },
  'WEATHER': {
    description: 'Describe weather conditions, seasons, and how climate affects your daily life.',
    difficulty: 'intermediate',
    category: 'Daily Life',
  },
  'HOUSE': {
    description: 'Describe your dream house, living spaces, and home decoration preferences.',
    difficulty: 'intermediate',
    category: 'Home',
  },
  'HEALTH': {
    description: 'Talk about health experiences, symptoms, and how to take care of yourself.',
    difficulty: 'advanced',
    category: 'Health',
  },
  'JOB': {
    description: 'Discuss your career, workplace, job responsibilities, and professional growth.',
    difficulty: 'advanced',
    category: 'Career',
  },
  'FUTURE GOALS': {
    description: 'Share your future plans, career ambitions, and strategies to achieve your goals.',
    difficulty: 'advanced',
    category: 'Career',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a URL-friendly slug from a title */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** Generate a short id prefix from the title (e.g., "pct-si" for "self-introduction") */
function makeIdPrefix(title: string): string {
  const words = title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length === 1) return 'pct-' + words[0].slice(0, 4);
  return 'pct-' + words.map(w => w[0]).join('');
}

/** Clean markdown escape characters and formatting from text */
function cleanText(text: string): string {
  let result = text;
  // Remove all markdown backslash escapes: \X → X
  result = result.replace(/\\([^\s])/g, '$1');
  // Remove bold markers wrapping text: **word** → word (BEFORE stripping orphans)
  result = result.replace(/\*\*(.*?)\*\*/g, '$1');
  // Remove any remaining orphaned ** or * markers
  result = result.replace(/\*\*/g, '');
  result = result.replace(/^\*\s*/, '');
  result = result.replace(/\s*\*$/, '');
  // Normalize whitespace
  result = result.replace(/\t+/g, ' ');
  result = result.replace(/\s+/g, ' ');
  // Fix missing spaces after sentence-ending punctuation followed by uppercase letter
  result = result.replace(/([.!?])([A-Z])/g, '$1 $2');
  result = result.trim();
  return result;
}

/** Extract the clean topic name from a CHỦ ĐỀ header line */
function extractTopicName(headerLine: string): string {
  // e.g., "# CHỦ ĐỀ 05: EMOTIONS & CHARACTERISTIC"
  // or   "# CHỦ ĐỀ 04: DESCRIBE PEOPLE \- APPEARANCE"
  const match = headerLine.match(/CHỦ ĐỀ \d+[:\s]+(.+)/);
  if (!match) return headerLine;
  return cleanText(match[1]).trim();
}

/** Parse speaker lines from conversation text block.
 *  Handles formats:
 *    **Name:**  text
 *    **Name**: text
 *    **Name** : text
 *    Name:  text
 */
function parseDialogueLines(block: string): { speaker: string; text: string }[] {
  const lines: { speaker: string; text: string }[] = [];

  // Split into individual lines
  const rawLines = block.split('\n');

  // Regex patterns for dialogue lines:
  // Pattern 1: **Name:**  text  or  **Name:**\ttext
  // Pattern 2: **Name**: text  or  **Name** : text
  // Pattern 3: Name: text (no bold)
  const speakerRegex = /^\s*\**([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]*?)\**\s*[:\uff1a]\s*(.+)/;

  let currentSpeaker = '';
  let currentText = '';

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      // Empty line - might separate paragraphs but preserve current speaker context
      continue;
    }

    const match = trimmed.match(speakerRegex);
    if (match) {
      // Save previous line if exists
      if (currentSpeaker && currentText) {
        lines.push({ speaker: currentSpeaker.trim(), text: cleanText(currentText) });
      }
      currentSpeaker = match[1].replace(/\*/g, '').trim();
      currentText = match[2];
    } else if (currentSpeaker) {
      // Continuation of the previous speaker's line
      currentText += ' ' + trimmed;
    }
  }

  // Don't forget the last line
  if (currentSpeaker && currentText) {
    lines.push({ speaker: currentSpeaker.trim(), text: cleanText(currentText) });
  }

  return lines;
}

// ─── Main extraction logic ───────────────────────────────────────────────────

function extractConversations(markdownContent: string): Conversation[] {
  const conversations: Conversation[] = [];

  // Split by topic headers: "# CHỦ ĐỀ NN: ..."
  const topicSections = markdownContent.split(/(?=^# CHỦ ĐỀ \d+)/m);

  for (const section of topicSections) {
    if (!section.trim()) continue;

    // Extract topic header
    const headerMatch = section.match(/^# (CHỦ ĐỀ \d+[:\s]+.+)/m);
    if (!headerMatch) continue;

    const topicName = extractTopicName(headerMatch[1]);
    const topicNumber = headerMatch[1].match(/\d+/)?.[0] || '00';

    console.log(`Processing: CHỦ ĐỀ ${topicNumber}: ${topicName}`);

    // Find "1.2. Hội thoại:" section
    const hoiThoaiMatch = section.match(
      /#{1,5}\s*\*{0,2}1\.2\.\s*Hội thoại[:\s]*\*{0,2}\s*\n([\s\S]*?)(?=\n\s*(?:#{1,5}\s|2\.\s*#{0,5}\s*\*{0,2}Từ vựng|$))/i
    );

    if (!hoiThoaiMatch) {
      console.warn(`  ⚠ No conversation section found for CHỦ ĐỀ ${topicNumber}`);
      continue;
    }

    const conversationBlock = hoiThoaiMatch[1];
    const dialogueLines = parseDialogueLines(conversationBlock);

    if (dialogueLines.length < 2) {
      console.warn(`  ⚠ Too few dialogue lines (${dialogueLines.length}) for CHỦ ĐỀ ${topicNumber}`);
      continue;
    }

    // Identify speakers: first speaker = AI, second unique speaker = User
    const speakerNames: string[] = [];
    for (const line of dialogueLines) {
      if (!speakerNames.includes(line.speaker)) {
        speakerNames.push(line.speaker);
      }
      if (speakerNames.length >= 2) break;
    }

    const aiSpeakerName = speakerNames[0];
    const userSpeakerName = speakerNames[1] || 'You';

    console.log(`  Speakers: AI="${aiSpeakerName}", User="${userSpeakerName}"`);
    console.log(`  Lines: ${dialogueLines.length}`);

    // Look up metadata
    const meta = topicMetadata[topicName] || {
      description: `Practice English conversation about ${topicName.toLowerCase()}.`,
      difficulty: parseInt(topicNumber) <= 4 ? 'beginner' as const
        : parseInt(topicNumber) <= 9 ? 'intermediate' as const
          : 'advanced' as const,
      category: 'General',
    };

    // Build conversation ID & line ID prefix
    const convId = `pct-${slugify(topicName)}`;
    const linePrefix = makeIdPrefix(topicName);

    // Convert dialogue lines to ConversationLine format
    const convLines: ConversationLine[] = dialogueLines.map((dl, idx) => {
      const isAi = dl.speaker === aiSpeakerName;
      const lineId = `${linePrefix}-${idx + 1}`;

      if (isAi) {
        return {
          id: lineId,
          speaker: 'ai' as const,
          text: dl.text,
        };
      } else {
        return {
          id: lineId,
          speaker: 'user' as const,
          text: dl.text,
          hint: dl.text,  // User's text mapped to hint field per requirements
        };
      }
    });

    // Post-processing: fix consecutive same-speaker lines
    // If two consecutive lines have the same speaker, flip the second one
    for (let i = 1; i < convLines.length; i++) {
      if (convLines[i].speaker === convLines[i - 1].speaker) {
        const flippedSpeaker = convLines[i].speaker === 'ai' ? 'user' as const : 'ai' as const;
        console.warn(`  ⚠ Fixed consecutive ${convLines[i].speaker} at line ${i + 1} → ${flippedSpeaker}`);
        convLines[i] = {
          id: convLines[i].id,
          speaker: flippedSpeaker,
          text: convLines[i].text,
          ...(flippedSpeaker === 'user' ? { hint: convLines[i].text } : {}),
        };
      }
    }

    // Calculate estimated time (roughly 30 seconds per line, 60s = 1 min)
    const estimatedTime = Math.max(3, Math.round(convLines.length * 0.5));

    const conversation: Conversation = {
      id: convId,
      title: topicName,
      description: meta.description,
      difficulty: meta.difficulty,
      category: meta.category,
      thumbnail: `/conversations/${convId}.svg`,
      estimatedTime,
      lines: convLines,
    };

    conversations.push(conversation);
  }

  return conversations;
}

// ─── Output generation ───────────────────────────────────────────────────────

function generateTypeScript(conversations: Conversation[]): string {
  const lines: string[] = [];

  lines.push('// ==================== PCT CONVERSATIONS (Auto-generated from PCT_TAI_LIEU_GIAO_TIEP.md) ====================');
  lines.push('// Generated by scripts/convertPCTConversations.ts');
  lines.push('');

  for (const conv of conversations) {
    lines.push('  {');
    lines.push(`    id: '${conv.id}',`);
    lines.push(`    title: '${conv.title.replace(/'/g, "\\'")}',`);
    lines.push(`    description: '${conv.description.replace(/'/g, "\\'")}',`);
    lines.push(`    difficulty: '${conv.difficulty}',`);
    lines.push(`    category: '${conv.category.replace(/'/g, "\\'")}',`);
    lines.push(`    thumbnail: '${conv.thumbnail}',`);
    lines.push(`    estimatedTime: ${conv.estimatedTime},`);
    lines.push('    lines: [');

    for (const line of conv.lines) {
      lines.push('      {');
      lines.push(`        id: '${line.id}',`);
      lines.push(`        speaker: '${line.speaker}',`);
      lines.push(`        text: ${JSON.stringify(line.text)},`);
      if (line.hint) {
        lines.push(`        hint: ${JSON.stringify(line.hint)},`);
      }
      lines.push('      },');
    }

    lines.push('    ],');
    lines.push('  },');
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const mdPath = path.resolve(__dirname, '..', 'docs', 'PCT_TAI_LIEU_GIAO_TIEP.md');
  const outputPath = path.resolve(__dirname, '..', 'data', 'pctConversations.generated.ts');

  console.log('Reading:', mdPath);
  const content = fs.readFileSync(mdPath, 'utf-8');

  const conversations = extractConversations(content);

  console.log(`\n✅ Extracted ${conversations.length} conversations\n`);

  // Generate full output file
  const tsOutput = `// Auto-generated from PCT_TAI_LIEU_GIAO_TIEP.md
// Run: npx tsx scripts/convertPCTConversations.ts
// Do not edit manually — regenerate from source.

import type { Conversation } from './conversations';

export const pctConversations: Conversation[] = [
${generateTypeScript(conversations)}];
`;

  fs.writeFileSync(outputPath, tsOutput, 'utf-8');
  console.log('Output written to:', outputPath);

  // Also print summary
  console.log('\n--- Summary ---');
  for (const conv of conversations) {
    console.log(`  [${conv.difficulty.padEnd(12)}] ${conv.id} — ${conv.title} (${conv.lines.length} lines, ~${conv.estimatedTime} min)`);
  }
}

main();
