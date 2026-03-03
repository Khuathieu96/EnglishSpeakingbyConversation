/**
 * Audio utilities for recording and merging audio blobs
 * Uses Web Audio API for processing
 */

type AudioContextConstructor = new () => AudioContext;

function createAudioContext(): AudioContext {
  const AudioContextClass = (window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext) as AudioContextConstructor;
  return new AudioContextClass();
}

function createMonoMix(buffer: AudioBuffer): Float32Array {
  const mono = new Float32Array(buffer.length);
  const channels = buffer.numberOfChannels;

  for (let channel = 0; channel < channels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      mono[i] += data[i] / channels;
    }
  }

  return mono;
}

function calculateRmsAndPeak(buffer: AudioBuffer): { rms: number; peak: number } {
  const mono = createMonoMix(buffer);
  if (mono.length === 0) {
    return { rms: 0, peak: 0 };
  }

  let sumSquares = 0;
  let peak = 0;

  for (let i = 0; i < mono.length; i++) {
    const value = mono[i];
    sumSquares += value * value;
    const amplitude = Math.abs(value);
    if (amplitude > peak) peak = amplitude;
  }

  return {
    rms: Math.sqrt(sumSquares / mono.length),
    peak,
  };
}

function sliceAudioBuffer(buffer: AudioBuffer, start: number, end: number): AudioBuffer {
  const safeStart = Math.max(0, Math.min(start, buffer.length - 1));
  const safeEnd = Math.max(safeStart + 1, Math.min(end, buffer.length));
  const frameLength = safeEnd - safeStart;

  const sliced = new AudioBuffer({
    numberOfChannels: buffer.numberOfChannels,
    length: frameLength,
    sampleRate: buffer.sampleRate,
  });

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const source = buffer.getChannelData(channel);
    const target = sliced.getChannelData(channel);
    target.set(source.subarray(safeStart, safeEnd));
  }

  return sliced;
}

function trimToSpeechRegion(buffer: AudioBuffer): AudioBuffer {
  const mono = createMonoMix(buffer);
  const sampleRate = buffer.sampleRate;
  const frameSize = Math.max(1, Math.floor(sampleRate * 0.02)); // 20ms
  const totalFrames = Math.ceil(mono.length / frameSize);
  const startProbeSamples = Math.min(mono.length, Math.floor(sampleRate * 0.35));

  let baseline = 0;
  for (let i = 0; i < startProbeSamples; i++) {
    baseline += mono[i] * mono[i];
  }
  baseline = Math.sqrt(baseline / Math.max(1, startProbeSamples));

  const threshold = Math.max(0.006, baseline * 1.8);
  const minActiveFrames = 3;
  const hangoverFrames = 7;

  let firstSpeechFrame = -1;
  let lastSpeechFrame = -1;
  let activeRun = 0;
  let hangover = 0;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const start = frameIndex * frameSize;
    const end = Math.min(start + frameSize, mono.length);

    let energy = 0;
    for (let i = start; i < end; i++) {
      energy += mono[i] * mono[i];
    }

    const rms = Math.sqrt(energy / Math.max(1, end - start));
    const active = rms >= threshold;

    if (active) {
      activeRun += 1;
      hangover = hangoverFrames;

      if (firstSpeechFrame < 0 && activeRun >= minActiveFrames) {
        firstSpeechFrame = Math.max(0, frameIndex - minActiveFrames + 1);
      }

      if (firstSpeechFrame >= 0) {
        lastSpeechFrame = frameIndex;
      }
    } else {
      activeRun = 0;
      if (firstSpeechFrame >= 0 && hangover > 0) {
        hangover -= 1;
        lastSpeechFrame = frameIndex;
      }
    }
  }

  if (firstSpeechFrame < 0 || lastSpeechFrame < firstSpeechFrame) {
    return buffer;
  }

  const startPadding = Math.floor(sampleRate * 0.09);
  const endPadding = Math.floor(sampleRate * 0.16);
  const startSample = Math.max(0, firstSpeechFrame * frameSize - startPadding);
  const endSample = Math.min(
    mono.length,
    (lastSpeechFrame + 1) * frameSize + endPadding,
  );

  if (endSample - startSample < Math.floor(sampleRate * 0.15)) {
    return buffer;
  }

  return sliceAudioBuffer(buffer, startSample, endSample);
}

function applyNoiseGateAndNormalize(buffer: AudioBuffer): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const edgeSamples = Math.min(buffer.length, Math.floor(sampleRate * 0.18));

  let noiseEstimate = 0;
  if (edgeSamples > 0) {
    const mono = createMonoMix(buffer);
    let sum = 0;

    for (let i = 0; i < edgeSamples; i++) {
      sum += mono[i] * mono[i];
    }
    for (let i = Math.max(0, mono.length - edgeSamples); i < mono.length; i++) {
      sum += mono[i] * mono[i];
    }

    noiseEstimate = Math.sqrt(sum / Math.max(1, edgeSamples * 2));
  }

  const gateThreshold = Math.min(0.022, Math.max(0.004, noiseEstimate * 1.15));
  let peak = 0;

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const amplitude = Math.abs(value);

      if (amplitude < gateThreshold) {
        data[i] = value * 0.8;
      }

      const processedAmplitude = Math.abs(data[i]);
      if (processedAmplitude > peak) peak = processedAmplitude;
    }
  }

  if (peak > 0.0001) {
    const targetPeak = 0.96;
    const gain = Math.min(3.4, targetPeak / peak);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(-1, Math.min(1, data[i] * gain));
      }
    }
  }

  return buffer;
}

async function renderVoiceEnhancedBuffer(input: AudioBuffer): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    input.numberOfChannels,
    input.length,
    input.sampleRate,
  );

  const source = offlineContext.createBufferSource();
  source.buffer = input;

  const highPass = offlineContext.createBiquadFilter();
  highPass.type = 'highpass';
  highPass.frequency.value = 120;

  const lowPass = offlineContext.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 7800;

  const presenceBoost = offlineContext.createBiquadFilter();
  presenceBoost.type = 'peaking';
  presenceBoost.frequency.value = 2200;
  presenceBoost.Q.value = 1.1;
  presenceBoost.gain.value = 4.5;

  const compressor = offlineContext.createDynamicsCompressor();
  compressor.threshold.value = -26;
  compressor.knee.value = 18;
  compressor.ratio.value = 4.0;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.18;

  const gain = offlineContext.createGain();
  gain.gain.value = 1.55;

  source.connect(highPass);
  highPass.connect(lowPass);
  lowPass.connect(presenceBoost);
  presenceBoost.connect(compressor);
  compressor.connect(gain);
  gain.connect(offlineContext.destination);

  source.start();
  const rendered = await offlineContext.startRendering();

  return applyNoiseGateAndNormalize(rendered);
}

export async function optimizeRecordedAudioBlob(blob: Blob): Promise<Blob> {
  try {
    const audioContext = createAudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(arrayBuffer);
    await audioContext.close();

    const trimmed = trimToSpeechRegion(decoded);
    const enhanced = await renderVoiceEnhancedBuffer(trimmed);
    const originalStats = calculateRmsAndPeak(decoded);
    const enhancedStats = calculateRmsAndPeak(enhanced);

    const isEnhancedTooWeak =
      enhancedStats.rms < originalStats.rms * 0.35 ||
      enhancedStats.peak < 0.015;

    if (isEnhancedTooWeak) {
      return blob;
    }

    return await audioBufferToBlob(enhanced);
  } catch (error) {
    console.error('Failed to optimize recorded audio blob:', error);
    return blob;
  }
}

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
    const audioContext = createAudioContext();

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
    const mergedBlob = await audioBufferToBlob(mergedBuffer);

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
  buffer: AudioBuffer
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
