'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from './conversation.module.css';
import { conversations, getConversationById } from '@/data/conversations';
import { useConversationBot } from '@/hooks/useConversationBot';
import { CompletionPopup } from '@/components/CompletionPopup';
import { BrowserWarning } from '@/components/BrowserWarning';
import { AppHeader } from '@/app/dashboard/components/AppHeader';
import { configureUtteranceVoice } from '@/lib/speechVoice';
import { dashboardAssets } from '@/app/dashboard/dashboardData';

const desktopUserImage = dashboardAssets.avatar;
const desktopAiImage = '/ava_teacher.png';
const mobileTutorImage = '/ava_teacher.png';

interface ExampleConversationScreenProps {
  conversationId?: string;
}

export function ExampleConversationScreen({
  conversationId = 'meeting-new-people',
}: ExampleConversationScreenProps) {
  const conversation = getConversationById(conversationId) ?? conversations[0];
  const [hasStarted, setHasStarted] = useState(false);
  const [activeAudioLineId, setActiveAudioLineId] = useState<string | null>(
    null,
  );
  const [isSentenceAudioPaused, setIsSentenceAudioPaused] = useState(false);
  const locale = useLocale();
  const t = useTranslations('conversation');
  const aiDisplayName = t('aiDisplayName');
  const lessonObjectives = useMemo(
    () => [
      { label: t('objective1'), done: true },
      { label: t('objective2'), done: false },
      { label: t('objective3'), done: false },
    ],
    [t],
  );
  const keyPhrases = useMemo(
    () => [
      t('keyPhrase1'),
      t('keyPhrase2'),
      t('keyPhrase3'),
      t('keyPhrase4'),
      t('keyPhrase5'),
    ],
    [t],
  );
  const sentenceUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentenceAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingCountRef = useRef(0);
  const lineTimestampRef = useRef<Record<string, string>>({});
  const replayCancelledRef = useRef(false);
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);
  const [activeReplayMode, setActiveReplayMode] = useState<
    'none' | 'user-track' | 'full-dialogue'
  >('none');
  const [userLineRecordingUrls, setUserLineRecordingUrls] = useState<
    Record<number, string>
  >({});

  const {
    botState,
    currentLine,
    speechRecognition,
    audioRecorder,
    startConversation,
    handleUserSpeak,
    handleStopSpeaking,
    handleSkipLine,
    reset,
    remainingAttempts,
  } = useConversationBot({
    conversation,
    onComplete: () => {
      // completion handled by UI state
    },
  });

  useEffect(() => {
    if (hasStarted) return;

    const timer = setTimeout(() => {
      startConversation();
      setHasStarted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [hasStarted, startConversation]);

  const userLineCount = useMemo(
    () => conversation.lines.filter((line) => line.speaker === 'user').length,
    [conversation.lines],
  );

  const progressPercent =
    userLineCount > 0
      ? Math.min(
          100,
          (botState.statistics.completedLines / userLineCount) * 100,
        )
      : 0;

  const hasCurrentUserTranscript =
    currentLine?.speaker === 'user' &&
    !!botState.userTranscripts[botState.currentLineIndex];

  const shouldShowCurrentLine =
    botState.state === 'ai_speaking' ||
    botState.state === 'processing' ||
    botState.state === 'retry' ||
    botState.state === 'success' ||
    botState.state === 'show_answer' ||
    hasCurrentUserTranscript;

  const displayLines = shouldShowCurrentLine
    ? conversation.lines.slice(0, botState.currentLineIndex + 1)
    : conversation.lines.slice(0, botState.currentLineIndex);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    [locale],
  );

  const getLineTimestamp = useCallback(
    (lineId: string) => {
      if (!lineTimestampRef.current[lineId]) {
        lineTimestampRef.current[lineId] = timeFormatter.format(new Date());
      }

      return lineTimestampRef.current[lineId];
    },
    [timeFormatter],
  );

  const isCaptureActive =
    speechRecognition.isListening || audioRecorder.isRecording;
  const isDetecting = speechRecognition.isListening;
  const canSpeak = botState.state === 'waiting_for_user';
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const levelFrameRef = useRef<number | null>(null);
  const desktopWaveBarsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const mobileWaveBarsRef = useRef<Array<HTMLDivElement | null>>([]);
  const desktopBarLevelsRef = useRef<number[]>([]);
  const mobileBarLevelsRef = useRef<number[]>([]);
  const desktopFilledRef = useRef(0);
  const mobileFilledRef = useRef(0);
  const noiseFloorRef = useRef(0.012);
  const peakLevelRef = useRef(0.08);
  const gatedLevelRef = useRef(0);
  const tailHoldFramesRef = useRef(0);

  // Voice-detected flag: true when the recogniser has picked up speech
  const voiceDetected =
    isDetecting &&
    !speechRecognition.silenceTimeoutReached &&
    !!speechRecognition.result?.transcript;
  const silenceCountdown = speechRecognition.silenceCountdownRemaining;
  const desktopMessagesRef = useRef<HTMLDivElement | null>(null);
  const mobileMessagesRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const total = audioRecorder.recordedBlobs.length;
    if (total <= recordingCountRef.current) return;

    if (currentLine?.speaker !== 'user') {
      recordingCountRef.current = total;
      return;
    }

    const latestBlob = audioRecorder.recordedBlobs[total - 1];
    if (!latestBlob || latestBlob.size === 0) {
      recordingCountRef.current = total;
      return;
    }

    const lineIndex = botState.currentLineIndex;
    const nextUrl = URL.createObjectURL(latestBlob);

    setUserLineRecordingUrls((prev) => {
      const previousUrl = prev[lineIndex];
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return {
        ...prev,
        [lineIndex]: nextUrl,
      };
    });

    recordingCountRef.current = total;
  }, [
    audioRecorder.recordedBlobs,
    botState.currentLineIndex,
    currentLine?.speaker,
  ]);

  // Equaliser bar helpers
  const MOBILE_BARS = 16;
  const desktopBarsCount = 64;
  const baseWaveLevel = 0.06;
  const getWaveBarHeight = useCallback(
    (
      level: number,
      index: number,
      totalBars: number,
      minHeight: number,
      maxHeight: number,
      levelBoost = 1,
    ) => {
      const center = (totalBars - 1) / 2;
      const distanceFromCenter = Math.abs(index - center) / Math.max(center, 1);
      const centerWeight = Math.cos((distanceFromCenter * Math.PI) / 2);
      const barWeight = 0.26 + 0.74 * Math.pow(centerWeight, 1.15);
      const barOffset = distanceFromCenter * 0.015;
      const effectiveLevel = Math.max(
        0,
        Math.min(1, level * levelBoost - barOffset),
      );
      const height =
        minHeight + effectiveLevel * (maxHeight - minHeight) * barWeight;

      return `${Math.max(minHeight, Math.min(maxHeight, height))}px`;
    },
    [],
  );

  const setWaveHeights = useCallback(
    (desktopLevels: number[], mobileLevels: number[]) => {
      desktopWaveBarsRef.current.forEach((bar, index) => {
        if (!bar) return;
        bar.style.height = getWaveBarHeight(
          desktopLevels[index] ?? 0,
          index,
          desktopBarsCount,
          4,
          32,
          1.25,
        );
      });

      mobileWaveBarsRef.current.forEach((bar, index) => {
        if (!bar) return;
        bar.style.height = getWaveBarHeight(
          mobileLevels[index] ?? 0,
          index,
          MOBILE_BARS,
          4,
          28,
          1.15,
        );
      });
    },
    [getWaveBarHeight],
  );

  const stopLevelMeter = useCallback(() => {
    if (levelFrameRef.current) {
      cancelAnimationFrame(levelFrameRef.current);
      levelFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    analyserRef.current = null;
    desktopBarLevelsRef.current = new Array(desktopBarsCount).fill(0);
    mobileBarLevelsRef.current = new Array(MOBILE_BARS).fill(0);
    desktopFilledRef.current = 0;
    mobileFilledRef.current = 0;
    setWaveHeights(desktopBarLevelsRef.current, mobileBarLevelsRef.current);
    noiseFloorRef.current = 0.012;
    peakLevelRef.current = 0.08;
    gatedLevelRef.current = 0;
    tailHoldFramesRef.current = 0;

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [MOBILE_BARS, desktopBarsCount, setWaveHeights]);

  useEffect(() => {
    if (!isDetecting) {
      stopLevelMeter();
      return;
    }

    let cancelled = false;

    const startLevelMeter = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: false,
            channelCount: 1,
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioContext = new window.AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.85;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        mediaStreamRef.current = stream;
        desktopBarLevelsRef.current = new Array(desktopBarsCount).fill(
          baseWaveLevel,
        );
        mobileBarLevelsRef.current = new Array(MOBILE_BARS).fill(baseWaveLevel);
        desktopFilledRef.current = 0;
        mobileFilledRef.current = 0;
        gatedLevelRef.current = baseWaveLevel;
        tailHoldFramesRef.current = 0;
        setWaveHeights(desktopBarLevelsRef.current, mobileBarLevelsRef.current);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const sample = () => {
          if (cancelled || !analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(data);

          const floorStartBin = 2;
          const floorEndBin = Math.min(220, data.length);
          let totalEnergy = 0;

          for (let i = floorStartBin; i < floorEndBin; i += 1) {
            totalEnergy += data[i] / 255;
          }

          const rawLevel =
            floorEndBin > floorStartBin
              ? totalEnergy / (floorEndBin - floorStartBin)
              : 0;
          const noiseFloor = noiseFloorRef.current;
          const nextNoiseFloor =
            rawLevel < noiseFloor
              ? noiseFloor * 0.92 + rawLevel * 0.08
              : noiseFloor * 0.995 + rawLevel * 0.005;
          noiseFloorRef.current = nextNoiseFloor;

          peakLevelRef.current = Math.max(
            rawLevel,
            peakLevelRef.current * 0.99,
            nextNoiseFloor + 0.03,
          );

          const dynamicRange = Math.max(
            0.02,
            peakLevelRef.current - nextNoiseFloor,
          );
          const normalizedLevel = Math.max(
            0,
            Math.min(1, (rawLevel - nextNoiseFloor) / dynamicRange),
          );

          const binWidth = audioContext.sampleRate / analyser.fftSize;
          const getBandEnergy = (startHz: number, endHz: number) => {
            const startBin = Math.max(2, Math.floor(startHz / binWidth));
            const endBin = Math.min(
              data.length - 1,
              Math.ceil(endHz / binWidth),
            );
            if (endBin <= startBin) return 0;

            let sum = 0;
            let count = 0;
            for (let i = startBin; i <= endBin; i += 1) {
              sum += data[i] / 255;
              count += 1;
            }

            return count > 0 ? sum / count : 0;
          };

          const speechBandEnergy = getBandEnergy(250, 3600);
          const lowNoiseEnergy = getBandEnergy(40, 180);
          const highNoiseEnergy = getBandEnergy(5000, 9000);
          const noiseBandEnergy =
            lowNoiseEnergy * 0.58 + highNoiseEnergy * 0.42;

          const speechContrast = Math.max(
            0,
            speechBandEnergy - noiseBandEnergy * 0.78,
          );
          const speechPresence = Math.max(
            0,
            Math.min(
              1,
              speechContrast / Math.max(0.06, speechBandEnergy + 0.01),
            ),
          );

          let filteredLevel = normalizedLevel * (0.4 + speechPresence * 0.9);

          const softGateThreshold = 0.15;
          if (filteredLevel < softGateThreshold) {
            const gateRatio = filteredLevel / softGateThreshold;
            filteredLevel = filteredLevel * (0.34 + 0.66 * gateRatio);
          }

          const previousLevel = gatedLevelRef.current;
          if (filteredLevel < previousLevel) {
            if (previousLevel > 0.09 && tailHoldFramesRef.current < 7) {
              tailHoldFramesRef.current += 1;
              filteredLevel = previousLevel * 0.9;
            } else {
              tailHoldFramesRef.current = 0;
              filteredLevel = previousLevel * 0.76 + filteredLevel * 0.24;
            }
          } else {
            tailHoldFramesRef.current = 0;
            filteredLevel = previousLevel * 0.42 + filteredLevel * 0.58;
          }

          filteredLevel = Math.max(baseWaveLevel, Math.min(1, filteredLevel));
          gatedLevelRef.current = filteredLevel;

          const nextDesktop = [...desktopBarLevelsRef.current];
          const nextMobile = [...mobileBarLevelsRef.current];

          const desktopIndex = Math.max(
            0,
            desktopBarsCount - 1 - desktopFilledRef.current,
          );
          const mobileIndex = Math.max(
            0,
            MOBILE_BARS - 1 - mobileFilledRef.current,
          );

          const desktopCurrent =
            desktopFilledRef.current < desktopBarsCount
              ? (nextDesktop[desktopIndex] ?? baseWaveLevel)
              : (nextDesktop[0] ?? baseWaveLevel);
          const mobileCurrent =
            mobileFilledRef.current < MOBILE_BARS
              ? (nextMobile[mobileIndex] ?? baseWaveLevel)
              : (nextMobile[0] ?? baseWaveLevel);

          const desktopTarget = Math.max(baseWaveLevel, filteredLevel * 1.15);
          const mobileTarget = Math.max(baseWaveLevel, filteredLevel * 1.05);

          const desktopNextValue =
            desktopTarget >= desktopCurrent
              ? desktopCurrent * 0.42 + desktopTarget * 0.58
              : desktopCurrent * 0.7 + desktopTarget * 0.3;

          const mobileNextValue =
            mobileTarget >= mobileCurrent
              ? mobileCurrent * 0.45 + mobileTarget * 0.55
              : mobileCurrent * 0.72 + mobileTarget * 0.28;

          if (desktopFilledRef.current < desktopBarsCount) {
            nextDesktop[desktopIndex] = desktopNextValue;
            desktopFilledRef.current += 1;
          } else {
            nextDesktop.pop();
            nextDesktop.unshift(desktopNextValue);
          }

          if (mobileFilledRef.current < MOBILE_BARS) {
            nextMobile[mobileIndex] = mobileNextValue;
            mobileFilledRef.current += 1;
          } else {
            nextMobile.pop();
            nextMobile.unshift(mobileNextValue);
          }

          desktopBarLevelsRef.current = nextDesktop;
          mobileBarLevelsRef.current = nextMobile;
          setWaveHeights(nextDesktop, nextMobile);
          levelFrameRef.current = requestAnimationFrame(sample);
        };

        sample();
      } catch {
        desktopBarLevelsRef.current = new Array(desktopBarsCount).fill(0);
        mobileBarLevelsRef.current = new Array(MOBILE_BARS).fill(0);
        desktopFilledRef.current = 0;
        mobileFilledRef.current = 0;
        gatedLevelRef.current = 0;
        tailHoldFramesRef.current = 0;
        setWaveHeights(desktopBarLevelsRef.current, mobileBarLevelsRef.current);
      }
    };

    void startLevelMeter();

    return () => {
      cancelled = true;
      stopLevelMeter();
    };
  }, [isDetecting, stopLevelMeter]);

  const scrollChatsToBottom = useCallback(() => {
    if (desktopMessagesRef.current) {
      desktopMessagesRef.current.scrollTop =
        desktopMessagesRef.current.scrollHeight;
    }

    if (mobileMessagesRef.current) {
      mobileMessagesRef.current.scrollTop =
        mobileMessagesRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(scrollChatsToBottom);
    return () => window.cancelAnimationFrame(frameId);
  }, [
    scrollChatsToBottom,
    displayLines.length,
    botState.currentLineIndex,
    botState.state,
    botState.matchingResult,
    botState.userTranscripts,
  ]);

  const stopSentenceAudio = useCallback(() => {
    if (sentenceAudioElementRef.current) {
      sentenceAudioElementRef.current.pause();
      sentenceAudioElementRef.current.currentTime = 0;
      sentenceAudioElementRef.current.onended = null;
      sentenceAudioElementRef.current.onerror = null;
      sentenceAudioElementRef.current = null;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    sentenceUtteranceRef.current = null;
    setActiveAudioLineId(null);
    setIsSentenceAudioPaused(false);
  }, []);

  const handleSentenceAudioToggle = useCallback(
    (lineId: string, text: string, isUser: boolean, lineIndex: number) => {
      if (isUser) {
        const recordedUrl = userLineRecordingUrls[lineIndex];

        if (recordedUrl) {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            sentenceUtteranceRef.current = null;
          }

          if (activeAudioLineId === lineId && sentenceAudioElementRef.current) {
            if (!sentenceAudioElementRef.current.paused) {
              sentenceAudioElementRef.current.pause();
              setIsSentenceAudioPaused(true);
              return;
            }

            void sentenceAudioElementRef.current.play();
            setIsSentenceAudioPaused(false);
            return;
          }

          if (sentenceAudioElementRef.current) {
            sentenceAudioElementRef.current.pause();
            sentenceAudioElementRef.current.currentTime = 0;
          }

          const audio = new Audio(recordedUrl);
          audio.onended = () => {
            sentenceAudioElementRef.current = null;
            setActiveAudioLineId(null);
            setIsSentenceAudioPaused(false);
          };
          audio.onerror = () => {
            sentenceAudioElementRef.current = null;
            setActiveAudioLineId(null);
            setIsSentenceAudioPaused(false);
          };

          sentenceAudioElementRef.current = audio;
          setActiveAudioLineId(lineId);
          setIsSentenceAudioPaused(false);
          void audio.play();
          return;
        }

        // Fallback for skipped user lines: read expected text with AI TTS.
        if (!text.trim()) {
          return;
        }

        if (typeof window === 'undefined' || !window.speechSynthesis) {
          return;
        }

        const synth = window.speechSynthesis;

        if (activeAudioLineId === lineId) {
          if (synth.speaking && !synth.paused) {
            synth.pause();
            setIsSentenceAudioPaused(true);
            return;
          }

          if (synth.paused) {
            synth.resume();
            setIsSentenceAudioPaused(false);
            return;
          }
        }

        synth.cancel();

        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        fallbackUtterance.lang = 'en-US';
        fallbackUtterance.rate = 0.9;
        fallbackUtterance.pitch = 1;
        fallbackUtterance.volume = 1;

        configureUtteranceVoice(fallbackUtterance, synth.getVoices());

        fallbackUtterance.onstart = () => {
          setActiveAudioLineId(lineId);
          setIsSentenceAudioPaused(false);
        };

        fallbackUtterance.onend = () => {
          setActiveAudioLineId(null);
          setIsSentenceAudioPaused(false);
        };

        fallbackUtterance.onerror = () => {
          setActiveAudioLineId(null);
          setIsSentenceAudioPaused(false);
        };

        sentenceUtteranceRef.current = fallbackUtterance;
        synth.speak(fallbackUtterance);
        return;
      }

      if (
        typeof window === 'undefined' ||
        !window.speechSynthesis ||
        !text.trim()
      ) {
        return;
      }

      const synth = window.speechSynthesis;

      if (activeAudioLineId === lineId) {
        if (synth.speaking && !synth.paused) {
          synth.pause();
          setIsSentenceAudioPaused(true);
          return;
        }

        if (synth.paused) {
          synth.resume();
          setIsSentenceAudioPaused(false);
          return;
        }
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.volume = 1;
      configureUtteranceVoice(utterance, synth.getVoices());
      utterance.onend = () => {
        sentenceUtteranceRef.current = null;
        setActiveAudioLineId(null);
        setIsSentenceAudioPaused(false);
      };
      utterance.onerror = () => {
        sentenceUtteranceRef.current = null;
        setActiveAudioLineId(null);
        setIsSentenceAudioPaused(false);
      };

      sentenceUtteranceRef.current = utterance;
      setActiveAudioLineId(lineId);
      setIsSentenceAudioPaused(false);
      synth.speak(utterance);
    },
    [activeAudioLineId, userLineRecordingUrls],
  );

  useEffect(() => {
    return () => {
      Object.values(userLineRecordingUrls).forEach((url) =>
        URL.revokeObjectURL(url),
      );
      if (sentenceAudioElementRef.current) {
        sentenceAudioElementRef.current.pause();
        sentenceAudioElementRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [userLineRecordingUrls]);

  const isAiSpeakingNow = botState.state === 'ai_speaking';

  const completionFluency =
    botState.statistics.totalLines > 0
      ? Math.round(
          ((botState.statistics.perfectLines +
            (botState.statistics.completedLines -
              botState.statistics.perfectLines) *
              0.85) /
            botState.statistics.totalLines) *
            100,
        )
      : 0;

  const handleRestartConversation = () => {
    replayCancelledRef.current = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (replayAudioRef.current) {
      replayAudioRef.current.pause();
      replayAudioRef.current.currentTime = 0;
      replayAudioRef.current = null;
    }
    setActiveReplayMode('none');
    if (sentenceAudioElementRef.current) {
      sentenceAudioElementRef.current.pause();
      sentenceAudioElementRef.current = null;
    }
    Object.values(userLineRecordingUrls).forEach((url) =>
      URL.revokeObjectURL(url),
    );
    setUserLineRecordingUrls({});
    recordingCountRef.current = 0;
    reset();
    setHasStarted(false);
  };

  const replayLines = useMemo(
    () =>
      conversation.lines
        .map((line, index) => {
          if (line.speaker === 'user') {
            const transcript = botState.userTranscripts[index];

            return {
              ...line,
              text: transcript ?? line.text,
              speaker: transcript ? line.speaker : 'ai',
            };
          }

          return line;
        })
        .filter((line) => line.text.trim().length > 0),
    [conversation.lines, botState.userTranscripts],
  );

  const userTrackSegments = useMemo(
    () =>
      conversation.lines.reduce<
        Array<{
          id: string;
          text: string;
          recordedUrl?: string;
          useTts: boolean;
        }>
      >((segments, line, index) => {
        if (line.speaker !== 'user') {
          return segments;
        }

        const recordedUrl = userLineRecordingUrls[index];
        const transcript = botState.userTranscripts[index];
        const text = transcript ?? line.text;

        if (!text.trim()) {
          return segments;
        }

        segments.push({
          id: line.id,
          text,
          recordedUrl,
          useTts: !recordedUrl,
        });

        return segments;
      }, []),
    [conversation.lines, botState.userTranscripts, userLineRecordingUrls],
  );

  const stopReplay = useCallback(() => {
    replayCancelledRef.current = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (replayAudioRef.current) {
      replayAudioRef.current.pause();
      replayAudioRef.current.currentTime = 0;
      replayAudioRef.current = null;
    }
    setActiveReplayMode('none');
  }, []);

  const playReplaySegments = useCallback(
    async (
      mode: 'user-track' | 'full-dialogue',
      segments: Array<{
        text: string;
        speaker: 'ai' | 'user';
        recordedUrl?: string;
        useTts?: boolean;
      }>,
    ) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        return;
      }

      if (activeReplayMode === mode) {
        stopReplay();
        return;
      }

      stopReplay();
      replayCancelledRef.current = false;
      setActiveReplayMode(mode);

      const synth = window.speechSynthesis;
      synth.cancel();

      for (const segment of segments) {
        if (replayCancelledRef.current) {
          break;
        }

        if (segment.recordedUrl && !segment.useTts) {
          await new Promise<void>((resolve) => {
            const audio = new Audio(segment.recordedUrl);
            replayAudioRef.current = audio;
            audio.onended = () => {
              replayAudioRef.current = null;
              resolve();
            };
            audio.onerror = () => {
              replayAudioRef.current = null;
              resolve();
            };
            void audio.play().catch(() => {
              replayAudioRef.current = null;
              resolve();
            });
          });
          continue;
        }

        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(segment.text);
          utterance.lang = 'en-US';
          utterance.rate = segment.speaker === 'ai' ? 0.9 : 0.95;
          utterance.pitch = segment.speaker === 'ai' ? 1 : 1.05;
          utterance.volume = 1;
          configureUtteranceVoice(utterance, synth.getVoices());
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          synth.speak(utterance);
        });
      }

      setActiveReplayMode('none');
    },
    [activeReplayMode, stopReplay],
  );

  const handleListenUserTrack = useCallback(async () => {
    const segments = userTrackSegments.map((segment) => ({
      text: segment.text,
      speaker: 'ai' as const,
      recordedUrl: segment.recordedUrl,
      useTts: segment.useTts,
    }));

    await playReplaySegments('user-track', segments);
  }, [playReplaySegments, userTrackSegments]);

  const handleListenFullDialogue = useCallback(async () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    const segments = replayLines.map((line, index) => {
      if (line.speaker === 'user') {
        const recordedUrl = userLineRecordingUrls[index];
        return {
          text: line.text,
          speaker: 'ai' as const,
          recordedUrl,
          useTts: !recordedUrl,
        };
      }

      return {
        text: line.text,
        speaker: 'ai' as const,
        useTts: true,
      };
    });

    await playReplaySegments('full-dialogue', segments);
  }, [playReplaySegments, replayLines, userLineRecordingUrls]);

  useEffect(() => {
    return () => {
      stopReplay();
    };
  }, [stopReplay]);

  return (
    <>
      <div className={styles.desktopOnly}>
        <div className={styles.desktopPage}>
          <AppHeader />

          <div className={styles.desktopMain}>
            <aside className={styles.desktopAside}>
              <div className={styles.asideTop}>
                <span className={styles.introPill}>{t('introduction')}</span>
                <h1>{conversation.title}</h1>
                <p>{conversation.description}</p>

                <div className={styles.asideSection}>
                  <h2>{t('learningObjectives')}</h2>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={objective.label}
                        className={
                          objective.done ? styles.objectiveDone : undefined
                        }
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.asideSection}>
                  <h2>{t('keyPhrases')}</h2>
                  <div className={styles.phrases}>
                    {keyPhrases.map((phrase) => (
                      <span key={phrase}>{phrase}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.proTip}>
                <div className={styles.proTipIcon}>
                  <span className='material-symbols-outlined'>lightbulb</span>
                </div>
                <div>
                  <p className={styles.proTipTitle}>{t('proTip')}</p>
                  <p className={styles.proTipText}>{t('proTipText')}</p>
                </div>
              </div>
            </aside>

            <section className={styles.desktopChatSection}>
              <div className={styles.browserWarningWrap}>
                <BrowserWarning />
              </div>

              <div className={styles.desktopChatHeader}>
                <div className={styles.tutorWrap}>
                  <div className={styles.tutorAvatarWrap}>
                    <img src={mobileTutorImage} alt={t('tutorAvatarAlt')} />
                    <span className={styles.onlineDot} />
                  </div>
                  <div>
                    <p className={styles.tutorName}>{aiDisplayName}</p>
                    <p className={styles.tutorState}>
                      {botState.state === 'ai_speaking'
                        ? t('speaking')
                        : t('listening')}
                    </p>
                  </div>
                </div>
                <div className={styles.chatTools}></div>
              </div>

              <div className={styles.desktopMessages} ref={desktopMessagesRef}>
                {displayLines.map((line, index) => {
                  const transcript = botState.userTranscripts[index];
                  const isUser = line.speaker === 'user';
                  const sentenceText =
                    isUser && transcript ? transcript : line.text;
                  const lineTime = getLineTimestamp(line.id);
                  const isActiveSentence = activeAudioLineId === line.id;
                  const sentenceIcon =
                    isActiveSentence && !isSentenceAudioPaused
                      ? 'pause'
                      : 'play_arrow';

                  return (
                    <div
                      key={line.id}
                      className={
                        isUser ? styles.desktopRowUser : styles.desktopRowAi
                      }
                    >
                      {!isUser && (
                        <img
                          src={desktopAiImage}
                          alt={t('aiAvatarAlt')}
                          className={styles.messageAvatar}
                        />
                      )}

                      <div className={styles.messageCol}>
                        <div
                          className={
                            isUser ? styles.userBubble : styles.aiBubble
                          }
                        >
                          <div
                            className={`${styles.bubbleSentenceRow} ${isUser ? styles.bubbleSentenceRowUser : styles.bubbleSentenceRowAi}`}
                          >
                            {!isUser && (
                              <button
                                className={styles.sentenceAudioBtn}
                                onClick={() =>
                                  handleSentenceAudioToggle(
                                    line.id,
                                    sentenceText,
                                    isUser,
                                    index,
                                  )
                                }
                                aria-label={t('sentenceAudioAria')}
                                disabled={isAiSpeakingNow}
                              >
                                <span className='material-symbols-outlined'>
                                  {sentenceIcon}
                                </span>
                              </button>
                            )}

                            <div className={styles.bubbleSentenceText}>
                              {sentenceText}
                            </div>

                            {isUser && (
                              <button
                                className={styles.sentenceAudioBtn}
                                onClick={() =>
                                  handleSentenceAudioToggle(
                                    line.id,
                                    sentenceText,
                                    isUser,
                                    index,
                                  )
                                }
                                aria-label={t('sentenceAudioAria')}
                                disabled={isAiSpeakingNow}
                              >
                                <span className='material-symbols-outlined'>
                                  {sentenceIcon}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                        <p
                          className={isUser ? styles.stampUser : styles.stampAi}
                        >
                          {isUser ? t('you') : aiDisplayName} • {lineTime}
                        </p>
                      </div>

                      {isUser && (
                        <img
                          src={desktopUserImage}
                          alt={t('userAvatarAlt')}
                          className={styles.messageAvatar}
                        />
                      )}
                    </div>
                  );
                })}

                {botState.matchingResult && (
                  <div
                    className={
                      botState.matchingResult.passed
                        ? styles.matchSuccess
                        : styles.matchError
                    }
                  >
                    {t('matchScore', {
                      score: Math.round(botState.matchingResult.similarity),
                    })}
                    {!botState.matchingResult.passed && (
                      <span>
                        {' '}
                        •{' '}
                        {t('expected', {
                          text: botState.matchingResult.expected,
                        })}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.desktopComposer}>
                <div className={styles.progressMeta}>
                  <p>{conversation.title}</p>
                  <p>
                    {botState.statistics.completedLines}/{userLineCount}{' '}
                    {t('phrases')}
                  </p>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className={styles.hintBox}>
                  {currentLine?.speaker === 'user'
                    ? t('sayHint', { text: currentLine.text })
                    : t('waitForAi')}
                </div>

                <div className={styles.desktopControls}>
                  <button
                    onClick={
                      isCaptureActive ? handleStopSpeaking : handleUserSpeak
                    }
                    disabled={!canSpeak && !isCaptureActive}
                    className={styles.primaryBtn}
                    aria-label={isCaptureActive ? t('stop') : t('tapToSpeak')}
                  >
                    {isDetecting ? (
                      <>
                        <span className={styles.tapSpeakWave}>
                          {Array.from({ length: desktopBarsCount }).map(
                            (_, i) => (
                              <span
                                key={i}
                                className={styles.tapSpeakWaveBar}
                                ref={(node) => {
                                  desktopWaveBarsRef.current[i] = node;
                                }}
                              />
                            ),
                          )}
                        </span>
                        <span className={styles.tapSpeakInlineNotice}>
                          {t('autoStopShort')}
                        </span>
                      </>
                    ) : (
                      t('tapToSpeak')
                    )}
                  </button>
                  <button onClick={handleSkipLine} className={styles.skipBtn}>
                    {t('skip')}
                  </button>
                </div>

                {remainingAttempts < 3 && (
                  <p className={styles.attemptsText}>
                    {t('attemptsRemaining', { count: remainingAttempts })}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className={styles.mobileOnly}>
        <div className={styles.mobilePage}>
          <header className={styles.mobileTopBar}>
            <div className={styles.mobileTutorInfo}>
              <div className={styles.mobileTutorAvatarWrap}>
                <img src={mobileTutorImage} alt={`${aiDisplayName} AI tutor`} />
                <span className={styles.onlineDot} />
              </div>
              <div>
                <p className={styles.mobileTutorName}>{aiDisplayName}</p>
                <p className={styles.mobileTutorRole}>{t('aiTutor')}</p>
              </div>
            </div>

            <div className={styles.mobileTopActions}></div>
          </header>

          <section className={styles.mobileLessonFocusWrap}>
            <details className={styles.mobileLessonFocusDetails}>
              <summary className={styles.mobileLessonFocus}>
                <span className='material-symbols-outlined'>auto_awesome</span>
                <span>{t('lessonFocus')}</span>
                <span className='material-symbols-outlined'>expand_more</span>
              </summary>

              <div className={styles.mobileLessonPaper}>
                <span className={styles.introPill}>{t('introduction')}</span>
                <h2 className={styles.mobilePaperTitle}>
                  {conversation.title}
                </h2>
                <p className={styles.mobilePaperDesc}>
                  {conversation.description}
                </p>

                <div className={styles.mobilePaperSection}>
                  <h3>{t('learningObjectives')}</h3>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={`mobile-${objective.label}`}
                        className={
                          objective.done ? styles.objectiveDone : undefined
                        }
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.mobilePaperSection}>
                  <h3>{t('keyPhrases')}</h3>
                  <div className={styles.phrases}>
                    {keyPhrases.map((phrase) => (
                      <span key={`mobile-${phrase}`}>{phrase}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.mobilePaperProTip}>
                  <div className={styles.proTipIcon}>
                    <span className='material-symbols-outlined'>lightbulb</span>
                  </div>
                  <div>
                    <p className={styles.proTipTitle}>{t('proTip')}</p>
                    <p className={styles.proTipText}>{t('proTipText')}</p>
                  </div>
                </div>
              </div>
            </details>
          </section>

          <main className={styles.mobileChatArea} ref={mobileMessagesRef}>
            <div className={styles.mobileTimestamp}>{t('mobileTimestamp')}</div>

            {displayLines.map((line, index) => {
              const transcript = botState.userTranscripts[index];
              const isUser = line.speaker === 'user';
              const lineTime = getLineTimestamp(line.id);

              return (
                <div
                  key={line.id}
                  className={isUser ? styles.mobileRowUser : styles.mobileRowAi}
                >
                  {!isUser && (
                    <div className={styles.mobileSmallIcon}>
                      <span className='material-symbols-outlined'>work</span>
                    </div>
                  )}

                  <div className={styles.mobileMessageContent}>
                    <div
                      className={
                        isUser ? styles.mobileUserBubble : styles.mobileAiBubble
                      }
                    >
                      {isUser && transcript ? transcript : line.text}
                    </div>
                    <p
                      className={
                        isUser ? styles.mobileStampUser : styles.mobileStampAi
                      }
                    >
                      {isUser ? t('you') : aiDisplayName} • {lineTime}
                    </p>
                  </div>

                  {isUser && (
                    <div className={styles.mobileSmallIconUser}>
                      <span className='material-symbols-outlined'>person</span>
                    </div>
                  )}
                </div>
              );
            })}

            {botState.matchingResult && (
              <div
                className={
                  botState.matchingResult.passed
                    ? styles.mobileMatchSuccess
                    : styles.mobileMatchError
                }
              >
                {t('match', {
                  score: Math.round(botState.matchingResult.similarity),
                })}
              </div>
            )}

            <div className={styles.mobileTypingRow}>
              <div className={styles.mobileSmallIconMuted}>
                <span className='material-symbols-outlined'>work</span>
              </div>
              <div className={styles.mobileTypingDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </main>

          <footer className={styles.mobileBottomControls}>
            <div className={styles.mobileVoiceWrap}>
              <button
                className={`${styles.mobileVoiceBtn} ${isDetecting ? styles.mobileVoiceBtnListening : ''} ${voiceDetected ? styles.mobileVoiceBtnVoiceDetected : ''}`}
                aria-label={t('tapToSpeak')}
                onClick={isCaptureActive ? handleStopSpeaking : handleUserSpeak}
                disabled={!canSpeak && !isCaptureActive}
              >
                <span className='material-symbols-outlined'>mic</span>
              </button>

              {isDetecting ? (
                <>
                  <div className={styles.mobileWaveStatusRow}>
                    {/* Mini equalizer waveform */}
                    <div className={styles.mobileWaveformRow}>
                      {Array.from({ length: MOBILE_BARS }).map((_, i) => (
                        <div
                          key={i}
                          className={`${styles.mobileWaveformBar} ${voiceDetected ? styles.waveActive : ''}`}
                          ref={(node) => {
                            mobileWaveBarsRef.current[i] = node;
                          }}
                        />
                      ))}
                    </div>
                    <span className={styles.mobileInlineNotice}>
                      {t('autoStopShort')}
                    </span>
                  </div>
                  {silenceCountdown !== null && (
                    <span className={styles.mobileCountdownText}>
                      {silenceCountdown}s
                    </span>
                  )}
                  <p>{voiceDetected ? t('voiceDetected') : t('stop')}</p>
                </>
              ) : (
                <p>{t('tapToSpeak')}</p>
              )}
            </div>

            <div className={styles.mobileProgressWrap}>
              <div className={styles.mobileProgressMeta}>
                <p>
                  {botState.statistics.completedLines}/{userLineCount}
                </p>
                <p>{t('attempts', { count: remainingAttempts })}</p>
              </div>
              <div className={styles.mobileProgressTrack}>
                <div
                  className={styles.mobileProgressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <nav className={styles.mobileBottomNav}>
              <Link href='/' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>home</span>
                <span>{t('home')}</span>
              </Link>
              <span
                className={`${styles.mobileNavItem} ${styles.mobileActive}`}
              >
                <span className='material-symbols-outlined'>chat_bubble</span>
                <span>{t('practice')}</span>
              </span>
              <Link href='/scenarios' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>menu_book</span>
                <span>{t('libraryNav')}</span>
              </Link>
            </nav>
          </footer>
        </div>
      </div>

      <CompletionPopup
        isOpen={botState.conversationComplete}
        onClose={handleRestartConversation}
        statistics={{
          totalSentences: botState.statistics.totalLines,
          completedSentences: botState.statistics.completedLines,
          retries: botState.statistics.totalRetries,
          fluency: completionFluency,
        }}
        onListenUserTrack={
          userTrackSegments.length > 0 ? handleListenUserTrack : undefined
        }
        onListenFullDialogue={
          replayLines.length > 0 ? handleListenFullDialogue : undefined
        }
        isListeningUserTrack={activeReplayMode === 'user-track'}
        isListeningFullDialogue={activeReplayMode === 'full-dialogue'}
        onPracticeAgain={handleRestartConversation}
      />
    </>
  );
}
