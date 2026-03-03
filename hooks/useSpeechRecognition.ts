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
  const INACTIVITY_WINDOW_MS = 2000;
  const AUTO_STOP_COUNTDOWN_MS = 3000;

  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isProcessing: false,
    error: null,
    result: null,
    silenceTimeoutReached: false,
    silenceCountdownRemaining: null,
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const isRecognitionActiveRef = useRef(false);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopReasonRef = useRef<'none' | 'manual' | 'silence'>('none');
  const hasDetectedSpeechRef = useRef(false);

  const clearInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      silenceCountdownRemaining: null,
    }));
  }, []);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const stopForSilence = useCallback((markNoSpeech: boolean) => {
    stopReasonRef.current = 'silence';

    setState((prev) => ({
      ...prev,
      silenceTimeoutReached: markNoSpeech,
      silenceCountdownRemaining: null,
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

  const startCountdownToAutoStop = useCallback(
    (markNoSpeech: boolean) => {
      clearCountdown();

      setState((prev) => ({
        ...prev,
        silenceCountdownRemaining: 3,
      }));

      countdownIntervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          silenceCountdownRemaining:
            prev.silenceCountdownRemaining === null
              ? null
              : Math.max(prev.silenceCountdownRemaining - 1, 0),
        }));
      }, 1000);

      countdownTimeoutRef.current = setTimeout(() => {
        clearCountdown();
        stopForSilence(markNoSpeech);
      }, AUTO_STOP_COUNTDOWN_MS);
    },
    [AUTO_STOP_COUNTDOWN_MS, clearCountdown, stopForSilence],
  );

  const scheduleInactivityWindow = useCallback(() => {
    clearInactivityTimeout();

    inactivityTimeoutRef.current = setTimeout(() => {
      if (stopReasonRef.current !== 'none') return;
      const markNoSpeech = !hasDetectedSpeechRef.current;
      startCountdownToAutoStop(markNoSpeech);
    }, INACTIVITY_WINDOW_MS);
  }, [INACTIVITY_WINDOW_MS, clearInactivityTimeout, startCountdownToAutoStop]);

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
      isRecognitionActiveRef.current = true;
      setState((prev) => ({
        ...prev,
        isListening: true,
        isProcessing: false,
        error: null,
        silenceTimeoutReached: false,
        silenceCountdownRemaining: null,
      }));

      // Start 2s inactivity window; if no text arrives, begin 3s countdown.
      scheduleInactivityWindow();
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

      // New text cancels countdown and restarts the 2s inactivity window.
      if (hasWords) {
        hasDetectedSpeechRef.current = true;
        clearCountdown();
        scheduleInactivityWindow();
      }

      setState((prev) => ({
        ...prev,
        result,
        isProcessing: lastResult.isFinal,
      }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      isStartingRef.current = false;
      if (event.error === 'aborted') {
        isRecognitionActiveRef.current = false;
      }
      let errorMessage = MESSAGES.SPEECH_RECOGNITION_ERROR;

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        stopReasonRef.current = 'manual';
        errorMessage = MESSAGES.MICROPHONE_PERMISSION_DENIED;
      } else if (event.error === 'no-speech') {
        // Keep session alive for no-speech; onend will auto-restart until timeout.
        return;
      } else if (event.error === 'audio-capture') {
        stopReasonRef.current = 'manual';
        errorMessage = 'No microphone found. Please check your device.';
      } else if (event.error === 'network') {
        stopReasonRef.current = 'manual';
        errorMessage = 'Network error occurred. Please check your connection.';
      } else if (event.error === 'aborted') {
        stopReasonRef.current = 'manual';
        // Aborted is normal when user stops manually
        setState((prev) => ({
          ...prev,
          isListening: false,
          isProcessing: false,
          error: null,
        }));
        return;
      } else {
        stopReasonRef.current = 'manual';
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
      isRecognitionActiveRef.current = false;

      clearInactivityTimeout();
      clearRestartTimeout();
      clearCountdown();

      if (stopReasonRef.current === 'none' && recognitionRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (
            !recognitionRef.current ||
            isStartingRef.current ||
            isRecognitionActiveRef.current ||
            stopReasonRef.current !== 'none'
          ) {
            return;
          }

          try {
            isStartingRef.current = true;
            recognitionRef.current.start();
          } catch {
            isStartingRef.current = false;
            setState((prev) => ({
              ...prev,
              isListening: false,
              isProcessing: false,
            }));
          }
        }, 120);

        return;
      }

      setState((prev) => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      clearInactivityTimeout();
      clearRestartTimeout();
      clearCountdown();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [
    clearCountdown,
    clearInactivityTimeout,
    clearRestartTimeout,
    isSupported,
    scheduleInactivityWindow,
  ]);

  // Start listening
  const startListening = useCallback(() => {
    if (
      !recognitionRef.current ||
      isStartingRef.current ||
      isRecognitionActiveRef.current
    )
      return;

    try {
      clearRestartTimeout();
      isStartingRef.current = true;
      stopReasonRef.current = 'none';
      hasDetectedSpeechRef.current = false;
      setState((prev) => ({
        ...prev,
        error: null,
        result: null,
        silenceTimeoutReached: false,
        silenceCountdownRemaining: null,
        isListening: true,
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
  }, [clearRestartTimeout]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    stopReasonRef.current = 'manual';

    clearInactivityTimeout();
    clearRestartTimeout();
    clearCountdown();

    // Immediate manual stop UX: finalize current transcript and exit listening now.
    setState((prev) => {
      const finalizedResult =
        prev.result && !prev.result.isFinal
          ? {
            ...prev.result,
            isFinal: true,
          }
          : prev.result;

      if (prev.result && !prev.result.isFinal) {
        return {
          ...prev,
          result: finalizedResult,
          isListening: false,
          isProcessing: !!finalizedResult,
          silenceCountdownRemaining: null,
        };
      }

      return {
        ...prev,
        isListening: false,
        isProcessing: !!finalizedResult,
        silenceCountdownRemaining: null,
      };
    });

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, [clearCountdown, clearInactivityTimeout, clearRestartTimeout]);

  // Reset state
  const reset = useCallback(() => {
    clearInactivityTimeout();
    clearRestartTimeout();
    clearCountdown();
    stopReasonRef.current = 'manual';
    hasDetectedSpeechRef.current = false;

    setState({
      isListening: false,
      isProcessing: false,
      error: null,
      result: null,
      silenceTimeoutReached: false,
      silenceCountdownRemaining: null,
    });
  }, [clearCountdown, clearInactivityTimeout, clearRestartTimeout]);

  return {
    ...state,
    isSupported: isSupported(),
    startListening,
    stopListening,
    reset,
  };
}
