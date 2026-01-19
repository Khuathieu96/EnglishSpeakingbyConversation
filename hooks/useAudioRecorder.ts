'use client';

/**
 * Custom hook for audio recording using MediaRecorder API
 * Records user's voice and stores blobs for later merging
 */

import { useState, useCallback, useRef } from 'react';
import {
  getSupportedMimeType,
  mergeAudioBlobs,
  requestMicrophonePermission,
} from '@/lib/audioUtils';
import { MESSAGES } from '@/lib/constants';
import { RecordingState } from '@/types';

export function useAudioRecorder() {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    recordedBlobs: [],
    mergedAudio: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentChunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await requestMicrophonePermission();
      streamRef.current = stream;

      // Get supported MIME type
      const mimeType = getSupportedMimeType();

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      currentChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          currentChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setState((prev) => ({
          ...prev,
          isRecording: true,
          error: null,
        }));
      };

      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const blob = new Blob(currentChunksRef.current, { type: mimeType });

        setState((prev) => ({
          ...prev,
          isRecording: false,
          recordedBlobs: [...prev.recordedBlobs, blob],
        }));

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setState((prev) => ({
          ...prev,
          isRecording: false,
          error: MESSAGES.RECORDING_ERROR,
        }));

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error:
          error instanceof Error
            ? error.message
            : MESSAGES.RECORDING_ERROR,
      }));
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  // Merge all recorded blobs
  const mergeRecordings = useCallback(async () => {
    if (state.recordedBlobs.length === 0) {
      setState((prev) => ({
        ...prev,
        error: 'No recordings to merge',
      }));
      return null;
    }

    try {
      const mergedBlob = await mergeAudioBlobs(state.recordedBlobs);
      setState((prev) => ({
        ...prev,
        mergedAudio: mergedBlob,
      }));
      return mergedBlob;
    } catch (error) {
      console.error('Error merging recordings:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to merge recordings',
      }));
      return null;
    }
  }, [state.recordedBlobs]);

  // Reset all recordings
  const reset = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setState({
      isRecording: false,
      recordedBlobs: [],
      mergedAudio: null,
      error: null,
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    mergeRecordings,
    reset,
    clearError,
    recordingCount: state.recordedBlobs.length,
  };
}
