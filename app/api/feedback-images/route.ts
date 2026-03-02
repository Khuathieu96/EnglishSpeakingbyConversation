import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export const runtime = 'nodejs';

export async function GET() {
  try {
    const feedbackDir = path.join(process.cwd(), 'public', 'feedbacks');
    const files = await readdir(feedbackDir);

    const images = files
      .filter((fileName) =>
        IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
      )
      .sort((first, second) => first.localeCompare(second))
      .map((fileName) => `/feedbacks/${fileName}`);

    return NextResponse.json(images);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
