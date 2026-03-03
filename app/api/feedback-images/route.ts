import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 24;

const parsePositiveInteger = (
  value: string | null,
  fallbackValue: number,
  maxValue?: number,
) => {
  if (!value) {
    return fallbackValue;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallbackValue;
  }

  if (typeof maxValue === 'number') {
    return Math.min(parsed, maxValue);
  }

  return parsed;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const offset = parsePositiveInteger(url.searchParams.get('offset'), 0);
    const limit = parsePositiveInteger(
      url.searchParams.get('limit'),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const feedbackDir = path.join(process.cwd(), 'public', 'feedbacks');
    const files = await readdir(feedbackDir);

    const images = files
      .filter((fileName) =>
        IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
      )
      .sort((first, second) => first.localeCompare(second))
      .map((fileName) => `/feedbacks/${fileName}`);

    const pagedImages = images.slice(offset, offset + limit);

    return NextResponse.json(
      {
        images: pagedImages,
        total: images.length,
        offset,
        limit,
        hasMore: offset + pagedImages.length < images.length,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=900',
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        images: [],
        total: 0,
        offset: 0,
        limit: DEFAULT_LIMIT,
        hasMore: false,
      },
      { status: 200 },
    );
  }
}
