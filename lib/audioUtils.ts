/**
 * Audio utilities for recording and merging audio blobs
 * Uses Web Audio API for processing
 */

import { AUDIO_CONFIG } from './constants';

/**
 * Merge multiple audio blobs into a single blob
 * @param blobs Array of audio blobs to merge
 * @returns Promise resolving to merged audio blob
 */
export async function mergeAudioBlobs(blobs: Blob[]): Promise<Blob> {
  if (blobs.length === 0) {
    throw new Error('No audio blobs to merge');
  }

  if (blobs.length === 1) {
    return blobs[0];
  }

  try {
    // Create audio context
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Decode all audio blobs
    const audioBuffers = await Promise.all(
      blobs.map(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
      })
    );

    // Calculate total length
    const totalLength = audioBuffers.reduce(
      (sum, buffer) => sum + buffer.length,
      0
    );

    // Create merged buffer
    const mergedBuffer = audioContext.createBuffer(
      audioBuffers[0].numberOfChannels,
      totalLength,
      audioBuffers[0].sampleRate
    );

    // Copy data from each buffer
    let offset = 0;
    for (const buffer of audioBuffers) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        mergedBuffer
          .getChannelData(channel)
          .set(buffer.getChannelData(channel), offset);
      }
      offset += buffer.length;
    }

    // Convert buffer to blob
    const mergedBlob = await audioBufferToBlob(mergedBuffer, audioContext);

    // Close audio context
    await audioContext.close();

    return mergedBlob;
  } catch (error) {
    console.error('Error merging audio blobs:', error);
    throw new Error('Failed to merge audio recordings');
  }
}

/**
 * Convert AudioBuffer to Blob
 */
async function audioBufferToBlob(
  buffer: AudioBuffer,
  audioContext: AudioContext
): Promise<Blob> {
  const offlineContext = new OfflineAudioContext(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineContext.destination);
  source.start();

  const renderedBuffer = await offlineContext.startRendering();

  // Convert to WAV format
  const wav = audioBufferToWav(renderedBuffer);
  return new Blob([wav], { type: 'audio/wav' });
}

/**
 * Convert AudioBuffer to WAV format
 */
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length * buffer.numberOfChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  const channels: Float32Array[] = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, buffer.numberOfChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
  view.setUint16(32, buffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

/**
 * Write string to DataView
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Create a download link for an audio blob
 */
export function downloadAudio(blob: Blob, filename: string = 'recording.wav'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get supported audio MIME type for MediaRecorder
 */
export function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return 'audio/webm'; // Fallback
}

/**
 * Check if audio recording is supported
 */
export function isRecordingSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    window.MediaRecorder
  );
}

/**
 * Request microphone permission
 */
export async function requestMicrophonePermission(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    throw new Error('Microphone access is required for voice recording');
  }
}

/**
 * Format audio duration in MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
