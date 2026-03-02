import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

type SuccessStory = {
  id: string;
  name: string;
  achievement: string;
  quote: string;
  rating: number;
  initials: string;
};

type SubmitStoryPayload = {
  name?: string;
  achievement?: string;
  quote?: string;
};

const MAX_NAME_LENGTH = 40;
const MAX_ACHIEVEMENT_LENGTH = 40;
const MAX_STORY_LENGTH = 150;
const storiesPath = path.join(
  process.cwd(),
  'public',
  'user-stories',
  'student-success-stories.json',
);

export const runtime = 'nodejs';

const normalizeValue = (value: string) => value.trim().replace(/\s+/g, ' ');

const buildInitials = (fullName: string) => {
  const normalizedName = normalizeValue(fullName);
  if (!normalizedName) {
    return 'SS';
  }

  const parts = normalizedName.split(' ').filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join('');
  return initials.toUpperCase();
};

const readStories = async () => {
  try {
    const content = await readFile(storiesPath, 'utf8');
    const parsed = JSON.parse(content) as SuccessStory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export async function POST(request: Request) {
  let payload: SubmitStoryPayload;

  try {
    payload = (await request.json()) as SubmitStoryPayload;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const name = normalizeValue(payload.name ?? '');
  const achievement = normalizeValue(payload.achievement ?? '');
  const quote = normalizeValue(payload.quote ?? '');

  if (!name || !achievement || !quote) {
    return NextResponse.json(
      { error: 'All fields are required.' },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    achievement.length > MAX_ACHIEVEMENT_LENGTH ||
    quote.length > MAX_STORY_LENGTH
  ) {
    return NextResponse.json(
      { error: 'One or more fields exceed maximum length.' },
      { status: 400 },
    );
  }

  const newStory: SuccessStory = {
    id: `story-${Date.now()}`,
    name,
    achievement,
    quote,
    rating: 5,
    initials: buildInitials(name),
  };

  try {
    const stories = await readStories();
    const updatedStories = [newStory, ...stories];

    await mkdir(path.dirname(storiesPath), { recursive: true });
    await writeFile(storiesPath, JSON.stringify(updatedStories, null, 2), 'utf8');

    return NextResponse.json(newStory, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save story.' },
      { status: 500 },
    );
  }
}
