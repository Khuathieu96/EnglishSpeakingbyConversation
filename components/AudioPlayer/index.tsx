'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/Button';
import { formatDuration } from '@/lib/audioUtils';

interface AudioPlayerProps {
  audioBlob: Blob | null;
  className?: string;
}

export function AudioPlayer({ audioBlob, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useTranslations('audio');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      // Create object URL for audio blob
      audioUrlRef.current = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrlRef.current;
        audioRef.current.load();
      }
    }

    return () => {
      // Clean up object URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [audioBlob]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!audioBlob) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <div className='flex items-center space-x-3 mb-3'>
        <Button
          onClick={isPlaying ? handlePause : handlePlay}
          variant='primary'
          size='sm'
        >
          {isPlaying ? t('pause') : t('play')}
        </Button>
        <div className='flex-1'>
          <div className='text-sm text-gray-600'>
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>
        </div>
      </div>

      <div className='relative'>
        <input
          type='range'
          min='0'
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          style={{
            background: `linear-gradient(to right, #144491 0%, #144491 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
