'use client';

/**
 * Custom hook for Web Speech Synthesis API
 * Handles text-to-speech functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SPEECH_LANG, SPEECH_RATE, SPEECH_PITCH } from '@/lib/constants';
import { configureUtteranceVoice } from '@/lib/speechVoice';

interface SpeechSynthesisState {
  isSpeaking: boolean;
  error: string | null;
}

export function useSpeechSynthesis() {
  const [state, setState] = useState<SpeechSynthesisState>({
    isSpeaking: false,
    error: null,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check if speech synthesis is supported
  const isSupported = useCallback(() => {
    return !!(typeof window !== 'undefined' && window.speechSynthesis);
  }, []);

  useEffect(() => {
    if (!isSupported()) {
      setState((prev) => ({
        ...prev,
        error: 'Speech synthesis is not supported in your browser',
      }));
      return;
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isSupported]);

  // Speak text
  const speak = useCallback(
    (text: string, options?: { onStart?: () => void; onEnd?: () => void; onError?: (error: Error) => void }) => {
      if (!synthRef.current || !isSupported()) {
        setState((prev) => ({
          ...prev,
          error: 'Speech synthesis is not available',
        }));
        return;
      }

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_LANG;
      utterance.rate = SPEECH_RATE;
      utterance.pitch = SPEECH_PITCH;
      configureUtteranceVoice(utterance, synthRef.current.getVoices());

      utterance.onstart = () => {
        setState((prev) => ({ ...prev, isSpeaking: true, error: null }));
        options?.onStart?.();
      };

      utterance.onend = () => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
        options?.onEnd?.();
      };

      utterance.onerror = (event) => {
        const error = new Error(`Speech synthesis error: ${event.error}`);
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          error: error.message,
        }));
        options?.onError?.(error);
      };

      utteranceRef.current = utterance;

      try {
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error('Error speaking:', error);
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          error: 'Failed to speak text',
        }));
      }
    },
    [isSupported]
  );

  // Cancel speaking
  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState((prev) => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // Pause speaking
  const pause = useCallback(() => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.pause();
    }
  }, []);

  // Resume speaking
  const resume = useCallback(() => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
    }
  }, []);

  // Get available voices
  const getVoices = useCallback(() => {
    if (!synthRef.current) return [];
    return synthRef.current.getVoices().filter((voice) =>
      voice.lang.startsWith('en')
    );
  }, []);

  return {
    ...state,
    isSupported: isSupported(),
    speak,
    cancel,
    pause,
    resume,
    getVoices,
  };
}
