'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/Button';

interface VoiceRecorderProps {
  isRecording: boolean;
  isListening: boolean;
  remainingAttempts: number;
  onRecord: () => void;
  onStopSpeaking?: () => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export function VoiceRecorder({
  isRecording,
  isListening,
  remainingAttempts,
  onRecord,
  onStopSpeaking,
  onSkip,
  disabled,
}: VoiceRecorderProps) {
  const isActive = isRecording || isListening;
  const t = useTranslations('voice');

  const getButtonText = () => {
    if (isActive) {
      return t('listening');
    }
    return t('tapToSpeak');
  };

  const getButtonVariant = () => {
    if (isActive) {
      return 'danger' as const;
    }
    return 'primary' as const;
  };

  return (
    <div className='space-y-3'>
      {/* Visual Recording Indicator */}
      {isActive && (
        <div className='flex items-center justify-center py-4'>
          <div className='relative flex items-center justify-center'>
            {/* Outer pulse rings */}
            <div className='absolute w-24 h-24 rounded-full bg-red-500 opacity-20 animate-ping'></div>
            <div className='absolute w-20 h-20 rounded-full bg-red-500 opacity-30 animate-pulse'></div>

            {/* Center microphone icon */}
            <div className='relative z-10 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl shadow-lg'>
              🎤
            </div>
          </div>
        </div>
      )}

      {/* Recording status text */}
      {isActive && (
        <div className='text-center'>
          <div className='text-lg font-medium text-red-600 animate-pulse'>
            {t('recording')}
          </div>
          <div className='text-sm text-gray-500 mt-1'>{t('speakClearly')}</div>
        </div>
      )}

      <div className='flex gap-3'>
        <Button
          onClick={onRecord}
          disabled={disabled || isActive}
          variant={getButtonVariant()}
          size='lg'
          className='flex-1'
        >
          {getButtonText()}
        </Button>

        {isActive && onStopSpeaking && (
          <Button
            onClick={onStopSpeaking}
            variant='danger'
            size='lg'
            className='px-6'
          >
            {t('stop')}
          </Button>
        )}

        {!isActive && onSkip && (
          <Button
            onClick={onSkip}
            variant='secondary'
            size='lg'
            className='px-6'
            title='Skip this line and move to next'
          >
            {t('skip')}
          </Button>
        )}
      </div>

      {remainingAttempts < 3 && (
        <div className='text-center text-sm text-gray-600'>
          {t('attemptsRemaining', { count: remainingAttempts })}
        </div>
      )}

      {isActive && (
        <div className='text-center space-y-2'>
          <div className='flex justify-center'>
            <div className='flex space-x-2'>
              <div
                className='w-2 h-2 bg-red-500 rounded-full animate-bounce'
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className='w-2 h-2 bg-red-500 rounded-full animate-bounce'
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className='w-2 h-2 bg-red-500 rounded-full animate-bounce'
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
          <div className='text-xs text-blue-600'>{t('speakClearlyStop')}</div>
        </div>
      )}
    </div>
  );
}
