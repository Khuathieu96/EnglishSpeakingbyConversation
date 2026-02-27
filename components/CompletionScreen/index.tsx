'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CompletionScreenProps {
  conversationTitle: string;
  statistics: {
    totalLines: number;
    completedLines: number;
    perfectLines: number;
    totalRetries: number;
  };
  onRestart: () => void;
}

export function CompletionScreen({
  conversationTitle,
  statistics,
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

  const progressPercent = Math.max(0, Math.min(100, averageMatch));

  return (
    <div className='min-h-screen bg-slate-500/45 flex items-center justify-center p-4'>
      <div className='w-full max-w-[540px] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden'>
        <div className='px-8 pt-10 pb-8 text-center'>
          <div className='mx-auto mb-8 h-20 w-20 rounded-full bg-[rgba(20,68,145,0.1)] flex items-center justify-center'>
            <span
              className='material-symbols-outlined text-5xl'
              style={{ color: 'var(--color-secondary)' }}
            >
              check_circle
            </span>
          </div>

          <h1 className='text-[46px] leading-[1.06] tracking-[-0.04em] font-bold text-slate-900'>
            {t('wellDone')}
          </h1>
          <p className='mt-2 text-lg text-slate-500'>{t('finished')}</p>
          <p className='mt-1 text-sm text-slate-400'>
            {t('subtitle', { title: conversationTitle })}
          </p>

          <div className='mt-7 grid grid-cols-3 gap-3'>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('sentences')}
              </p>
              <p className='mt-1 text-[34px] leading-9 font-bold text-slate-900'>
                {statistics.completedLines}/{statistics.totalLines}
              </p>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('retries')}
              </p>
              <p className='mt-1 text-[34px] leading-9 font-bold text-slate-900'>
                {statistics.totalRetries}
              </p>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('fluency')}
              </p>
              <p className='mt-1 text-[34px] leading-9 font-bold text-slate-900'>
                {averageMatch}%
              </p>
            </div>
          </div>

          <div className='mt-6 rounded-3xl border px-4 py-4 text-left'
            style={{
              borderColor: 'rgba(20, 68, 145, 0.16)',
              backgroundColor: 'rgba(20, 68, 145, 0.06)',
            }}
          >
            <div className='mb-2 flex items-center justify-between text-sm font-semibold'>
              <span style={{ color: 'var(--color-secondary)' }}>{t('overallScore')}</span>
              <span style={{ color: 'var(--color-secondary)' }}>{t('excellent')}</span>
            </div>
            <div className='h-2.5 w-full rounded-full bg-[rgba(20,68,145,0.2)]'>
              <div
                className='h-full rounded-full'
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--color-secondary)',
                }}
              />
            </div>
          </div>

          <div className='mt-8 flex flex-col gap-3'>
            <button
              onClick={onRestart}
              className='h-14 w-full rounded-3xl text-white text-[30px] leading-[1] font-bold shadow-lg hover:opacity-95'
              style={{
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 10px 15px -3px rgba(252,108,2,0.22), 0 4px 6px -4px rgba(252,108,2,0.22)',
              }}
            >
              {t('practiceAgain')}
            </button>

            <Link
              href='/scenarios'
              className='h-14 w-full rounded-3xl bg-slate-100 text-slate-700 text-[30px] leading-[1] font-bold flex items-center justify-center'
            >
              {t('backToScenarios')}
            </Link>
          </div>
        </div>

        <div className='h-1.5 w-full bg-gradient-to-r from-[rgba(20,68,145,0.3)] via-[#144491] to-[rgba(20,68,145,0.3)]' />
      </div>
    </div>
  );
}
