// Types
export interface ConversationLine {
  id:  string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty:  'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  estimatedTime: number; // in minutes
  lines: ConversationLine[];
}

// Sample Conversations Data
export const conversations: Conversation[] = [];

// Import and merge PCT conversations
import { pctConversations } from './pctConversations.generated';
conversations.push(...pctConversations);

// Helper functions
export const getConversationById = (id: string): Conversation | undefined => {
  return conversations.find((conv) => conv.id === id);
};

export const getConversationsByDifficulty = (
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Conversation[] => {
  return conversations.filter((conv) => conv.difficulty === difficulty);
};

export const getConversationsByCategory = (category: string): Conversation[] => {
  return conversations.filter(
    (conv) => conv.category. toLowerCase() === category.toLowerCase()
  );
};

export const getAllCategories = (): string[] => {
  const categories = conversations.map((conv) => conv.category);
  return [...new Set(categories)];
};

export const getAllDifficulties = (): string[] => {
  return ['beginner', 'intermediate', 'advanced'];
};

// Get user lines count for a conversation (for progress tracking)
export const getUserLinesCount = (conversationId: string): number => {
  const conversation = getConversationById(conversationId);
  if (!conversation) return 0;
  return conversation.lines. filter((line) => line.speaker === 'user').length;
};