'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { AudioPlayer } from '../AudioPlayer';
import { Card, CardBody } from '../ui/Card';

interface CompletionScreenProps {
  conversationTitle: string;
  statistics: {
    totalLines: number;
    completedLines: number;
    perfectLines: number;
    totalRetries: number;
  };
  mergedAudio: Blob | null;
  onRestart: () => void;
}

export function CompletionScreen({
  conversationTitle,
  statistics,
  mergedAudio,
  onRestart,
}: CompletionScreenProps) {
  const averageMatch =
    statistics.totalLines > 0
      ? Math.round(
          ((statistics.perfectLines +
            (statistics.completedLines - statistics.perfectLines) * 0.85) /
            statistics.totalLines) *
            100,
        )
      : 0;

  const t = useTranslations('completion');

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='max-w-2xl w-full'>
        <CardBody className='p-8 text-center space-y-6'>
          <div className='text-6xl mb-4'>🎉</div>
          <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='text-xl text-gray-600'>
            {t('subtitle', { title: conversationTitle })}
          </p>

          {/* Statistics */}
          <div className='grid grid-cols-2 gap-4 my-6'>
            <div className='bg-blue-50 rounded-lg p-4'>
              <div className='text-3xl font-bold text-blue-600'>
                {statistics.completedLines}/{statistics.totalLines}
              </div>
              <div className='text-sm text-blue-700'>{t('linesCompleted')}</div>
            </div>
            <div className='bg-green-50 rounded-lg p-4'>
              <div className='text-3xl font-bold text-green-600'>
                {statistics.perfectLines}
              </div>
              <div className='text-sm text-green-700'>{t('perfectLines')}</div>
            </div>
            <div className='bg-yellow-50 rounded-lg p-4'>
              <div className='text-3xl font-bold text-yellow-600'>
                {statistics.totalRetries}
              </div>
              <div className='text-sm text-yellow-700'>{t('retriesUsed')}</div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4'>
              <div className='text-3xl font-bold text-purple-600'>
                {averageMatch}%
              </div>
              <div className='text-sm text-purple-700'>{t('averageMatch')}</div>
            </div>
          </div>

          {/* Audio Player */}
          {mergedAudio && (
            <div className='text-left'>
              <h3 className='text-lg font-semibold mb-3 text-gray-900'>
                {t('listenRecording')}
              </h3>
              <AudioPlayer audioBlob={mergedAudio} />
            </div>
          )}

          {/* Actions */}
          <div className='flex space-x-4 justify-center pt-6'>
            <Button onClick={onRestart} variant='secondary' size='lg'>
              {t('restart')}
            </Button>
            <Link href='/'>
              <Button variant='primary' size='lg'>
                {t('backToList')}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
