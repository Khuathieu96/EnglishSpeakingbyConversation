import React from 'react';
import { ConversationLine } from '@/types';

interface MessageBubbleProps {
  line: ConversationLine;
  matchingPercentage?: number;
  showMatchResult?: boolean;
  userTranscript?: string; // What user actually said
}

export function MessageBubble({ line, matchingPercentage, showMatchResult, userTranscript }: MessageBubbleProps) {
  const isAI = line.speaker === 'ai';
  const hasTranscript = !isAI && userTranscript;

  const bubbleStyles = isAI
    ? 'bg-gray-100 text-gray-900 mr-auto'
    : 'bg-blue-600 text-white ml-auto';

  const alignmentStyles = isAI ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex ${alignmentStyles} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${bubbleStyles}`}>
        {isAI && <div className="text-xs opacity-70 mb-1">AI Assistant</div>}
        
        {hasTranscript ? (
          <div className="space-y-2">
            <div>
              <div className="text-xs opacity-70 mb-1">You said:</div>
              <p className="text-base leading-relaxed font-medium">{userTranscript}</p>
            </div>
            <div className="border-t border-white/30 pt-2">
              <div className="text-xs opacity-70 mb-1">Expected:</div>
              <p className="text-sm leading-relaxed opacity-80 italic">{line.text}</p>
            </div>
          </div>
        ) : (
          <p className="text-base leading-relaxed">{line.text}</p>
        )}
        {showMatchResult && matchingPercentage !== undefined && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span>Match:</span>
              <span className="font-bold">{matchingPercentage}%</span>
            </div>
            {matchingPercentage >= 80 ? (
              <div className="text-xs mt-1">✅ Passed!</div>
            ) : (
              <div className="text-xs mt-1">❌ Try again</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
