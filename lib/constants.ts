// Text matching thresholds
export const MATCHING_THRESHOLD = 80; // 80% similarity required to pass
export const MAX_RETRY_ATTEMPTS = 3; // Maximum attempts before showing answer

// Speech configuration
export const SPEECH_LANG = 'en-US';
export const SPEECH_RATE = 0.92;
export const SPEECH_PITCH = 0.95;

// Recognition configuration
export const RECOGNITION_CONFIG = {
  lang: SPEECH_LANG,
  continuous: false,
  interimResults: true,
  maxAlternatives: 3,
};

// Audio recording configuration
export const AUDIO_CONFIG = {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000,
};

// Supported browsers
export const SUPPORTED_BROWSERS = ['Chrome', 'Edge', 'Safari'];

// UI Messages
export const MESSAGES = {
  MICROPHONE_PERMISSION_DENIED: 'Microphone permission denied. Please enable it in your browser settings.',
  SPEECH_RECOGNITION_ERROR: 'Speech recognition error. Please try again.',
  UNSUPPORTED_BROWSER: 'Your browser does not support all required features. Please use Chrome for the best experience.',
  RECORDING_ERROR: 'Failed to record audio. Please check your microphone.',
  PROCESSING: 'Processing your speech...',
  SUCCESS: 'Great! Moving to the next line.',
  RETRY: 'Not quite right. Try again!',
  SHOW_ANSWER: 'The correct answer is:',
};
