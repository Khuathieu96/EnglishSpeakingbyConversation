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
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
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
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      }));

      // Start 5-second timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 5000); // 5 seconds
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
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isStartingRef.current) return;

    try {
      isStartingRef.current = true;
      setState((prev) => ({
        ...prev,
        error: null,
        result: null,
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

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

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
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      isListening: false,
      isProcessing: false,
      error: null,
      result: null,
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
