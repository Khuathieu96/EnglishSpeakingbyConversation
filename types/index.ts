// Core conversation types
export interface ConversationLine {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  hint?: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  estimatedTime: number; // in minutes
  lines: ConversationLine[];
}

// Conversation state machine
export type ConversationState =
  | 'idle'
  | 'ai_speaking'
  | 'waiting_for_user'
  | 'processing'
  | 'success'
  | 'retry'
  | 'show_answer'
  | 'completed';

// Speech recognition
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionState {
  isListening: boolean;
  isProcessing: boolean;
  error: string | null;
  result: SpeechRecognitionResult | null;
  silenceTimeoutReached: boolean;
  silenceCountdownRemaining: number | null;
}

// Text matching
export interface MatchingResult {
  similarity: number;
  passed: boolean;
  transcript: string;
  expected: string;
}

// Audio recording
export interface RecordingState {
  isRecording: boolean;
  recordedBlobs: Blob[];
  mergedAudio: Blob | null;
  error: string | null;
}

// Conversation bot state
export interface ConversationBotState {
  state: ConversationState;
  currentLineIndex: number;
  attemptCount: number;
  matchingResult: MatchingResult | null;
  conversationComplete: boolean;
  userTranscripts: Record<number, string>; // lineIndex -> user's spoken text
  statistics: {
    totalLines: number;
    completedLines: number;
    perfectLines: number;
    totalRetries: number;
  };
}

// Browser compatibility
export interface BrowserCompatibility {
  isSupported: boolean;
  hasSpeechRecognition: boolean;
  hasSpeechSynthesis: boolean;
  hasMediaRecorder: boolean;
  browserName: string;
}
