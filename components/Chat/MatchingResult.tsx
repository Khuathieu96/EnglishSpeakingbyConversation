import React from 'react';
import { MatchingResult } from '@/types';
import { getMatchingMessage } from '@/lib/textMatching';

interface MatchingResultDisplayProps {
  result: MatchingResult;
}

export function MatchingResultDisplay({ result }: MatchingResultDisplayProps) {
  const message = getMatchingMessage(result.similarity);
  const bgColor = result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className={`p-4 rounded-lg border ${bgColor} space-y-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Matching Result</span>
        <span className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.similarity}%
        </span>
      </div>
      
      {!result.passed && (
        <div className="space-y-2">
          <div className="bg-white/50 rounded p-3">
            <div className="text-xs font-medium text-red-700 mb-1">You said:</div>
            <p className="text-sm text-gray-900">&quot;{result.transcript}&quot;</p>
          </div>
          <div className="bg-white/50 rounded p-3">
            <div className="text-xs font-medium text-green-700 mb-1">Expected:</div>
            <p className="text-sm text-gray-900">&quot;{result.expected}&quot;</p>
          </div>
        </div>
      )}
      
      <p className={`text-sm ${result.passed ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
    </div>
  );
}
