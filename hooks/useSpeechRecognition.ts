'use client';

/**
 * Custom hook for Web Speech Recognition API
 * Handles voice input and transcription
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { RECOGNITION_CONFIG, MESSAGES } from '@/lib/constants';
import { SpeechRecognitionState, SpeechRecognitionResult as AppSpeechRecognitionResult } from '@/types';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isProcessing: false,
    error: null,
    result: null,
    silenceTimeoutReached: false,
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  const stopForSilence = useCallback((markNoSpeech: boolean) => {
    setState((prev) => ({
      ...prev,
      silenceTimeoutReached: markNoSpeech,
      result:
        prev.result && !prev.result.isFinal
          ? {
              ...prev.result,
              isFinal: true,
            }
          : prev.result,
      isProcessing: !!prev.result,
    }));

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const scheduleSilenceTimeout = useCallback(
    (durationMs: number, markNoSpeech: boolean) => {
      clearSilenceTimeout();

      silenceTimeoutRef.current = setTimeout(() => {
        stopForSilence(markNoSpeech);
      }, durationMs);
    },
    [clearSilenceTimeout, stopForSilence],
  );

  // Check if speech recognition is supported
  const isSupported = useCallback(() => {
    return !!(
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported()) {
      setState((prev) => ({
        ...prev,
        error: MESSAGES.UNSUPPORTED_BROWSER,
      }));
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = RECOGNITION_CONFIG.continuous;
    recognition.interimResults = RECOGNITION_CONFIG.interimResults;
    recognition.lang = RECOGNITION_CONFIG.lang;
    recognition.maxAlternatives = RECOGNITION_CONFIG.maxAlternatives;

    recognition.onstart = () => {
      isStartingRef.current = false;
      setState((prev) => ({
        ...prev,
        isListening: true,
        isProcessing: false,
        error: null,
        silenceTimeoutReached: false,
      }));

      // Start initial no-speech timeout (no recognized words)
      scheduleSilenceTimeout(3000, true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const alternative = lastResult[0];

      const result: AppSpeechRecognitionResult = {
        transcript: alternative.transcript,
        confidence: alternative.confidence,
        isFinal: lastResult.isFinal,
      };

      const hasWords = alternative.transcript.trim().length > 0;

      // While user is speaking, keep listening; stop only when silent for 2 seconds
      if (hasWords) {
        scheduleSilenceTimeout(2000, false);
      }

      setState((prev) => ({
        ...prev,
        result,
        isProcessing: lastResult.isFinal,
      }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      isStartingRef.current = false;
      let errorMessage = MESSAGES.SPEECH_RECOGNITION_ERROR;

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        errorMessage = MESSAGES.MICROPHONE_PERMISSION_DENIED;
      } else if (event.error === 'no-speech') {
        // Don't treat no-speech as a fatal error - just let it end naturally
        // The user can try again by clicking the button
        setState((prev) => ({
          ...prev,
          isListening: false,
          isProcessing: false,
          error: null, // Clear error for no-speech - not critical
        }));
        return;
      } else if (event.error === 'audio-capture') {
        errorMessage = 'No microphone found. Please check your device.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error occurred. Please check your connection.';
      } else if (event.error === 'aborted') {
        // Aborted is normal when user stops manually
        setState((prev) => ({
          ...prev,
          isListening: false,
          isProcessing: false,
          error: null,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        error: errorMessage,
      }));
    };

    recognition.onend = () => {
      isStartingRef.current = false;

      clearSilenceTimeout();

      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimeout();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [clearSilenceTimeout, isSupported, scheduleSilenceTimeout]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isStartingRef.current) return;

    try {
      isStartingRef.current = true;
      setState((prev) => ({
        ...prev,
        error: null,
        result: null,
        silenceTimeoutReached: false,
      }));
      recognitionRef.current.start();
    } catch (error) {
      isStartingRef.current = false;
      console.error('Error starting recognition:', error);
      setState((prev) => ({
        ...prev,
        error: MESSAGES.SPEECH_RECOGNITION_ERROR,
      }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    clearSilenceTimeout();

    // If there's an interim result, mark it as final before stopping
    setState((prev) => {
      if (prev.result && !prev.result.isFinal) {
        return {
          ...prev,
          result: {
            ...prev.result,
            isFinal: true,
          },
        };
      }
      return prev;
    });

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [clearSilenceTimeout]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      isListening: false,
      isProcessing: false,
      error: null,
      result: null,
      silenceTimeoutReached: false,
    });
  }, []);

  return {
    ...state,
    isSupported: isSupported(),
    startListening,
    stopListening,
    reset,
  };
}
