import { SPEECH_LANG } from '@/lib/constants';

const preferredVoiceNameHints = [
  'aria',
  'jenny',
  'samantha',
  'karen',
  'zira',
  'serena',
  'ava',
  'emma',
  'olivia',
  'susan',
  'female',
];

const naturalVoiceHints = ['natural', 'neural', 'premium', 'enhanced'];

export function getPreferredEnglishFemaleVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const normalizedLang = SPEECH_LANG.toLowerCase();

  const scored = voices
    .map((voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      let score = 0;

      if (lang === normalizedLang) score += 6;
      else if (lang.startsWith('en-us')) score += 5;
      else if (lang.startsWith('en')) score += 3;

      if (voice.localService) score += 1;

      if (preferredVoiceNameHints.some((hint) => name.includes(hint))) {
        score += 5;
      }

      if (naturalVoiceHints.some((hint) => name.includes(hint))) {
        score += 4;
      }

      if (name.includes('google us english')) score += 2;

      return { voice, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].voice : null;
}

export function configureUtteranceVoice(
  utterance: SpeechSynthesisUtterance,
  voices: SpeechSynthesisVoice[],
) {
  const preferredVoice = getPreferredEnglishFemaleVoice(voices);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  }
}
