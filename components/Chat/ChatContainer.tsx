'use client';

import React, { useRef, useEffect } from 'react';
import { ConversationLine, ConversationState, MatchingResult } from '@/types';
import { MessageBubble } from './MessageBubble';
import { VoiceRecorder } from './VoiceRecorder';
import { MatchingResultDisplay } from './MatchingResult';
import { ScriptHint } from './ScriptHint';

interface ChatContainerProps {
  lines: ConversationLine[];
  currentLineIndex: number;
  currentLine?: ConversationLine;
  state: ConversationState;
  matchingResult: MatchingResult | null;
  remainingAttempts: number;
  userTranscripts: Record<number, string>;
  onUserSpeak: () => void;
  onStopSpeaking?: () => void;
  onSkipLine?: () => void;
  isRecording: boolean;
  isListening: boolean;
}

export function ChatContainer({
  lines,
  currentLineIndex,
  currentLine,
  state,
  matchingResult,
  remainingAttempts,
  userTranscripts,
  onUserSpeak,
  onStopSpeaking,
  onSkipLine,
  isRecording,
  isListening,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLineIndex, matchingResult, state]);

  // Get displayable lines - show completed lines, current AI line, or current user line if they've spoken
  // If user has already spoken for current line (transcript exists), keep showing it
  const hasCurrentUserTranscript = currentLine?.speaker === 'user' && userTranscripts[currentLineIndex];
  const shouldShowCurrentLine = 
    state === 'ai_speaking' || // Show AI speaking
    state === 'retry' || // Show user's answer during retry
    state === 'success' || // Show user's answer on success
    state === 'processing' || // Show during processing
    hasCurrentUserTranscript; // Keep showing if user has spoken for this line
    
  const displayLines = shouldShowCurrentLine
    ? lines.slice(0, currentLineIndex + 1) // Include current line
    : lines.slice(0, currentLineIndex); // Only show completed lines

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {displayLines.map((line, index) => {
          // Show transcript if it exists and it's a user line
          const shouldShowTranscript = line.speaker === 'user' && userTranscripts[index];
          
          return (
            <MessageBubble 
              key={line.id} 
              line={line} 
              userTranscript={shouldShowTranscript ? userTranscripts[index] : undefined}
            />
          );
        })}

        {/* Show matching result */}
        {state === 'processing' && (
          <div className="text-center text-gray-500 py-2">
            <div className="animate-pulse">Processing your speech...</div>
          </div>
        )}

        {matchingResult && (state === 'success' || state === 'retry') && (
          <MatchingResultDisplay result={matchingResult} />
        )}

        {state === 'show_answer' && currentLine && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm font-medium text-yellow-800 mb-2">
              💡 The correct answer is:
            </div>
            <p className="text-base text-yellow-900 font-medium">&quot;{currentLine.text}&quot;</p>
            <p className="text-sm text-yellow-600 mt-2">Moving to the next line...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User input area */}
      {state === 'waiting_for_user' && currentLine && currentLine.speaker === 'user' && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-4">
          <ScriptHint line={currentLine} />
          <VoiceRecorder
            isRecording={isRecording}
            isListening={isListening}
            remainingAttempts={remainingAttempts}
            onRecord={onUserSpeak}
            onStopSpeaking={onStopSpeaking}
            onSkip={onSkipLine}
          />
        </div>
      )}

      {state === 'ai_speaking' && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 text-center text-gray-500">
          AI is speaking...
        </div>
      )}

      {state === 'completed' && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 text-center">
          <p className="text-green-600 font-medium">🎉 Conversation completed!</p>
        </div>
      )}
    </div>
  );
}
