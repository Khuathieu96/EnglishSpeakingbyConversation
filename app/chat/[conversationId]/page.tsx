'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getConversationById } from '@/data/conversations';
import { useConversationBot } from '@/hooks/useConversationBot';
import { ChatContainer } from '@/components/Chat';
import { CompletionScreen } from '@/components/CompletionScreen';
import { BrowserWarning } from '@/components/BrowserWarning';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface ChatPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const { conversationId } = use(params);
  const conversation = getConversationById(conversationId);

  const [hasStarted, setHasStarted] = useState(false);

  const {
    botState,
    currentLine,
    speechRecognition,
    audioRecorder,
    startConversation,
    handleUserSpeak,
    handleStopSpeaking,
    handleSkipLine,
    reset,
    remainingAttempts,
  } = useConversationBot({
    conversation: conversation!,
    onComplete: () => {
      // Conversation completed
    },
  });

  useEffect(() => {
    if (!conversation) {
      router.push('/');
    }
  }, [conversation, router]);

  useEffect(() => {
    // Auto-start conversation after component mounts
    if (conversation && !hasStarted) {
      const timer = setTimeout(() => {
        startConversation();
        setHasStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [conversation, hasStarted, startConversation]);

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  // Show completion screen
  if (botState.conversationComplete) {
    return (
      <CompletionScreen
        conversationTitle={conversation.title}
        statistics={botState.statistics}
        mergedAudio={audioRecorder.mergedAudio}
        onRestart={() => {
          reset();
          setHasStarted(false);
        }}
      />
    );
  }

  // Calculate progress
  const userLinesCount = conversation.lines.filter(
    (line) => line.speaker === 'user'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
            >
              ← Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {conversation.title}
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>

          <ProgressBar
            current={botState.statistics.completedLines}
            total={userLinesCount}
            showLabel={true}
          />
        </div>
      </header>

      {/* Browser Warning */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        <BrowserWarning />
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="h-[calc(100vh-180px)] bg-white shadow-sm">
          {botState.state === 'idle' ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎤</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Ready to Practice?
                </h2>
                <p className="text-gray-600 mb-4">
                  The conversation will start in a moment...
                </p>
                <div className="animate-pulse text-blue-600">
                  Preparing...
                </div>
              </div>
            </div>
          ) : (
            <ChatContainer
              lines={conversation.lines}
              currentLineIndex={botState.currentLineIndex}
              currentLine={currentLine}
              state={botState.state}
              matchingResult={botState.matchingResult}
              remainingAttempts={remainingAttempts}
              userTranscripts={botState.userTranscripts}
              onUserSpeak={handleUserSpeak}
              onStopSpeaking={handleStopSpeaking}
              onSkipLine={handleSkipLine}
              isRecording={audioRecorder.isRecording}
              isListening={speechRecognition.isListening}
            />
          )}
        </div>
      </div>

      {/* Error Display */}
      {(speechRecognition.error || audioRecorder.error) && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md shadow-lg">
          <div className="text-sm font-medium text-red-800 mb-1">Error</div>
          <p className="text-sm text-red-600">
            {speechRecognition.error || audioRecorder.error}
          </p>
        </div>
      )}
    </div>
  );
}
