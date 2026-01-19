/**
 * Text matching algorithm using Levenshtein distance
 * Compares user's spoken text with expected text to calculate similarity
 */

import { MATCHING_THRESHOLD } from './constants';
import { MatchingResult } from '@/types';

/**
 * Normalize text for comparison
 * - Convert to lowercase
 * - Remove punctuation
 * - Trim and collapse multiple spaces
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of single-character edits needed to change one string into the other
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create a 2D array for dynamic programming
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Initialize first column and row
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity percentage between two texts
 * Returns a percentage (0-100) indicating how similar the texts are
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);

  if (normalized1 === '' && normalized2 === '') return 100;
  if (normalized1 === '' || normalized2 === '') return 0;

  const maxLength = Math.max(normalized1.length, normalized2.length);
  const distance = levenshteinDistance(normalized1, normalized2);

  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.min(100, similarity)); // Clamp between 0-100
}

/**
 * Compare user's transcript with expected text
 * Returns a MatchingResult with similarity score and pass/fail status
 */
export function matchText(
  userTranscript: string,
  expectedText: string
): MatchingResult {
  const similarity = calculateSimilarity(userTranscript, expectedText);
  const passed = similarity >= MATCHING_THRESHOLD;

  return {
    similarity: Math.round(similarity),
    passed,
    transcript: userTranscript,
    expected: expectedText,
  };
}

/**
 * Get a user-friendly message based on matching result
 */
export function getMatchingMessage(similarity: number): string {
  if (similarity >= 95) return 'Perfect! Excellent pronunciation!';
  if (similarity >= 90) return 'Great job! Very close!';
  if (similarity >= MATCHING_THRESHOLD) return 'Good! You passed!';
  if (similarity >= 70) return 'Almost there! Try again.';
  if (similarity >= 50) return 'Not quite. Give it another try!';
  return 'Let\'s try that again. Take your time.';
}

/**
 * Highlight differences between user transcript and expected text
 * Returns an array of words with match status
 */
export interface WordComparison {
  word: string;
  matched: boolean;
}

export function compareWords(
  userTranscript: string,
  expectedText: string
): WordComparison[] {
  const userWords = normalizeText(userTranscript).split(' ');
  const expectedWords = normalizeText(expectedText).split(' ');

  return expectedWords.map((expectedWord, index) => {
    const userWord = userWords[index] || '';
    const matched = userWord === expectedWord;
    return { word: expectedWord, matched };
  });
}
