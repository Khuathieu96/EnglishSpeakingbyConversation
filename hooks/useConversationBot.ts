'use client';

/**
 * Custom hook for managing conversation bot state machine
 * Coordinates speech recognition, synthesis, text matching, and audio recording
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudioRecorder } from './useAudioRecorder';
import { matchText } from '@/lib/textMatching';
import { MAX_RETRY_ATTEMPTS } from '@/lib/constants';
import {
  Conversation,
  ConversationLine,
  ConversationState,
  ConversationBotState,
} from '@/types';

interface UseConversationBotProps {
  conversation: Conversation;
  onComplete?: () => void;
}

const MATCH_FEEDBACK_DURATION_MS = 5000;

export function useConversationBot({ conversation, onComplete }: UseConversationBotProps) {
  const [botState, setBotState] = useState<ConversationBotState>({
    state: 'idle',
    currentLineIndex: 0,
    attemptCount: 0,
    matchingResult: null,
    conversationComplete: false,
    userTranscripts: {},
    statistics: {
      totalLines: conversation.lines.filter((line) => line.speaker === 'user').length,
      completedLines: 0,
      perfectLines: 0,
      totalRetries: 0,
    },
  });

  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();
  const audioRecorder = useAudioRecorder();

  const hasStartedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const currentLine: ConversationLine | undefined = conversation.lines[botState.currentLineIndex];

  // Start conversation
  const startConversation = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (currentLine && currentLine.speaker === 'ai') {
      setBotState((prev) => ({ ...prev, state: 'ai_speaking' }));
      speechSynthesis.speak(currentLine.text, {
        onEnd: () => {
          // Move to next line
          setBotState((prev) => {
            if (prev.state !== 'ai_speaking') return prev;

            return {
              ...prev,
              currentLineIndex: prev.currentLineIndex + 1,
              state: 'waiting_for_user',
            };
          });
        },
      });
    }
  }, [currentLine, speechSynthesis]);

  // Handle user starting to speak
  const handleUserSpeak = useCallback(async () => {
    if (botState.state !== 'waiting_for_user' || !currentLine) return;

    // Start recording
    await audioRecorder.startRecording();

    // Start recognition
    speechRecognition.startListening();
  }, [botState.state, currentLine, audioRecorder, speechRecognition]);

  // Handle user stopping speaking manually
  const handleStopSpeaking = useCallback(() => {
    // Stop recording
    audioRecorder.stopRecording();

    // Stop recognition
    speechRecognition.stopListening();
  }, [audioRecorder, speechRecognition]);

  // Process recognition result
  useEffect(() => {
    if (
      !speechRecognition.result ||
      !speechRecognition.result.isFinal ||
      botState.state !== 'waiting_for_user' ||
      isProcessingRef.current
    ) {
      return;
    }

    isProcessingRef.current = true;

    const processResult = async () => {
      // Stop recording
      audioRecorder.stopRecording();

      setBotState((prev) => ({ ...prev, state: 'processing' }));

      // Match text
      const result = matchText(speechRecognition.result!.transcript, currentLine!.text);

      setBotState((prev) => ({
        ...prev,
        matchingResult: result,
      }));

      if (result.passed) {
        // Success
        const isPerfect = result.similarity >= 95;

        setBotState((prev) => ({
          ...prev,
          state: 'success',
          userTranscripts: {
            ...prev.userTranscripts,
            [prev.currentLineIndex]: result.transcript,
          },
          statistics: {
            ...prev.statistics,
            completedLines: prev.statistics.completedLines + 1,
            perfectLines: isPerfect
              ? prev.statistics.perfectLines + 1
              : prev.statistics.perfectLines,
          },
        }));

        // Move to next line after delay
        setTimeout(() => {
          moveToNextLine();
        }, MATCH_FEEDBACK_DURATION_MS);
      } else {
        // Failed - check retry count
        const newAttemptCount = botState.attemptCount + 1;

        if (newAttemptCount >= MAX_RETRY_ATTEMPTS) {
          // Show answer
          setBotState((prev) => ({
            ...prev,
            state: 'show_answer',
            attemptCount: newAttemptCount,
            userTranscripts: {
              ...prev.userTranscripts,
              [prev.currentLineIndex]: result.transcript,
            },
            statistics: {
              ...prev.statistics,
              totalRetries: prev.statistics.totalRetries + 1,
              completedLines: prev.statistics.completedLines + 1,
            },
          }));

          // Auto-proceed after showing answer
          setTimeout(() => {
            moveToNextLine();
          }, MATCH_FEEDBACK_DURATION_MS);
        } else {
          // Retry
          setBotState((prev) => ({
            ...prev,
            state: 'retry',
            attemptCount: newAttemptCount,
            userTranscripts: {
              ...prev.userTranscripts,
              [prev.currentLineIndex]: result.transcript,
            },
            statistics: {
              ...prev.statistics,
              totalRetries: prev.statistics.totalRetries + 1,
            },
          }));

          // Reset to waiting after delay
          setTimeout(() => {
            setBotState((prev) => ({
              ...prev,
              state: 'waiting_for_user',
              matchingResult: null,
            }));
            speechRecognition.reset();
            isProcessingRef.current = false;
          }, MATCH_FEEDBACK_DURATION_MS);
        }
      }

      isProcessingRef.current = false;
    };

    processResult();
  }, [speechRecognition.result, botState.state, botState.attemptCount, currentLine, audioRecorder]);

  // Move to next line
  const moveToNextLine = useCallback(() => {
    const nextIndex = botState.currentLineIndex + 1;

    if (nextIndex >= conversation.lines.length) {
      // Conversation complete
      setBotState((prev) => ({
        ...prev,
        state: 'completed',
        conversationComplete: true,
      }));

      // Merge audio recordings
      audioRecorder.mergeRecordings();

      onComplete?.();
      return;
    }

    const nextLine = conversation.lines[nextIndex];

    if (nextLine.speaker === 'ai') {
      // AI speaks next
      setBotState((prev) => ({
        ...prev,
        state: 'ai_speaking',
        currentLineIndex: nextIndex,
        attemptCount: 0,
        matchingResult: null,
      }));

      speechRecognition.reset();
      isProcessingRef.current = false;

      speechSynthesis.speak(nextLine.text, {
        onEnd: () => {
          // Check if there's a user line next
          setBotState((prev) => {
            if (prev.state !== 'ai_speaking' || prev.currentLineIndex !== nextIndex) {
              return prev;
            }

            const afterAIIndex = nextIndex + 1;
            if (afterAIIndex < conversation.lines.length) {
              return {
                ...prev,
                currentLineIndex: afterAIIndex,
                state: 'waiting_for_user',
              };
            }

            return {
              ...prev,
              state: 'completed',
              conversationComplete: true,
            };
          });

          const afterAIIndex = nextIndex + 1;
          if (afterAIIndex >= conversation.lines.length) {
            audioRecorder.mergeRecordings();
            onComplete?.();
          }
        },
      });
    } else {
      // User speaks next
      setBotState((prev) => ({
        ...prev,
        state: 'waiting_for_user',
        currentLineIndex: nextIndex,
        attemptCount: 0,
        matchingResult: null,
      }));

      speechRecognition.reset();
      isProcessingRef.current = false;
    }
  }, [botState.currentLineIndex, conversation.lines, speechSynthesis, speechRecognition, audioRecorder, onComplete]);

  // Handle user skipping current line
  const handleSkipLine = useCallback(() => {
    if (
      botState.state !== 'waiting_for_user' &&
      botState.state !== 'retry' &&
      botState.state !== 'ai_speaking'
    ) {
      return;
    }

    const isSkippingAiLine = currentLine?.speaker === 'ai';

    if (isSkippingAiLine) {
      speechSynthesis.cancel();
    }

    // Stop any active recording/recognition
    if (audioRecorder.isRecording) {
      audioRecorder.stopRecording();
    }
    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    }

    if (!isSkippingAiLine) {
      // Mark user line as skipped and move to next
      setBotState((prev) => ({
        ...prev,
        state: 'success',
        statistics: {
          ...prev.statistics,
          completedLines: prev.statistics.completedLines + 1,
        },
      }));
    }

    // Move to next line after short delay
    setTimeout(() => {
      moveToNextLine();
    }, isSkippingAiLine ? 100 : 500);
  }, [
    botState.state,
    currentLine?.speaker,
    speechSynthesis,
    audioRecorder,
    speechRecognition,
    moveToNextLine,
  ]);

  // If no words are detected within 3 seconds, stop current capture but stay on the same user turn
  useEffect(() => {
    if (
      !speechRecognition.silenceTimeoutReached ||
      botState.state !== 'waiting_for_user' ||
      isProcessingRef.current
    ) {
      return;
    }

    if (audioRecorder.isRecording) {
      audioRecorder.stopRecording();
    }

    setBotState((prev) => ({
      ...prev,
      state: 'waiting_for_user',
      matchingResult: null,
    }));

    speechRecognition.reset();
  }, [
    speechRecognition.silenceTimeoutReached,
    botState.state,
    audioRecorder,
    speechRecognition,
  ]);

  // Reset conversation
  const reset = useCallback(() => {
    hasStartedRef.current = false;
    isProcessingRef.current = false;
    speechSynthesis.cancel();
    speechRecognition.reset();
    audioRecorder.reset();
    setBotState({
      state: 'idle',
      currentLineIndex: 0,
      attemptCount: 0,
      matchingResult: null,
      conversationComplete: false,
      userTranscripts: {},
      statistics: {
        totalLines: conversation.lines.filter((line) => line.speaker === 'user').length,
        completedLines: 0,
        perfectLines: 0,
        totalRetries: 0,
      },
    });
  }, [conversation.lines, speechSynthesis, speechRecognition, audioRecorder]);

  return {
    botState,
    currentLine,
    speechRecognition,
    speechSynthesis,
    audioRecorder,
    startConversation,
    handleUserSpeak,
    handleStopSpeaking,
    handleSkipLine,
    reset,
    remainingAttempts: MAX_RETRY_ATTEMPTS - botState.attemptCount,
  };
}
