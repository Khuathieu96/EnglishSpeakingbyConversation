'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface CompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  statistics: {
    totalSentences: number;
    completedSentences: number;
    retries: number;
    fluency: number;
  };
  onPracticeAgain?: () => void;
  onBackToScenarios?: () => void;
}

export function CompletionPopup({
  isOpen,
  onClose,
  userName = 'Alex',
  statistics,
  onPracticeAgain,
  onBackToScenarios,
}: CompletionPopupProps) {
  const t = useTranslations('completion');

  if (!isOpen) {
    return null;
  }

  const progressPercent = Math.max(0, Math.min(100, statistics.fluency));

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-slate-800/40 p-4'>
      <div className='relative w-full max-w-[540px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl'>
        <button
          aria-label='Close completion popup'
          onClick={onClose}
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>

        <div className='px-8 pb-8 pt-10 text-center'>
          <div
            className='mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full'
            style={{ backgroundColor: 'rgba(20, 68, 145, 0.1)' }}
          >
            <span
              className='material-symbols-outlined text-5xl'
              style={{ color: 'var(--color-secondary)' }}
            >
              check_circle
            </span>
          </div>

          <h2 className='text-[52px] font-bold leading-[1.02] tracking-[-0.03em] text-slate-900'>
            {t('wellDone', { name: userName })}
          </h2>
          <p className='mt-2 text-[36px] font-semibold leading-tight text-slate-500'>
            {t('finished')}
          </p>

          <div className='mt-7 grid grid-cols-3 gap-3'>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('sentences')}
              </p>
              <p className='mt-1 text-[34px] font-bold leading-9 text-slate-900'>
                {statistics.completedSentences}/{statistics.totalSentences}
              </p>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('retries')}
              </p>
              <p className='mt-1 text-[34px] font-bold leading-9 text-slate-900'>
                {statistics.retries}
              </p>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
                {t('fluency')}
              </p>
              <p className='mt-1 text-[34px] font-bold leading-9 text-slate-900'>
                {statistics.fluency}%
              </p>
            </div>
          </div>

          <div
            className='mt-6 rounded-3xl border px-4 py-4 text-left'
            style={{
              borderColor: 'rgba(20, 68, 145, 0.16)',
              backgroundColor: 'rgba(20, 68, 145, 0.06)',
            }}
          >
            <div className='mb-2 flex items-center justify-between text-sm font-semibold'>
              <span style={{ color: 'var(--color-secondary)' }}>
                {t('overallScore')}
              </span>
              <span style={{ color: 'var(--color-secondary)' }}>
                {t('excellent')}
              </span>
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
              onClick={onPracticeAgain ?? onClose}
              className='h-14 w-full rounded-3xl text-[34px] font-bold leading-none text-white'
              style={{
                backgroundColor: 'var(--color-secondary)',
                boxShadow:
                  '0 10px 15px -3px rgba(20,68,145,0.22), 0 4px 6px -4px rgba(20,68,145,0.22)',
              }}
            >
              {t('practiceAgain')}
            </button>

            <button
              onClick={onBackToScenarios ?? onClose}
              className='h-14 w-full rounded-3xl bg-slate-100 text-[34px] font-bold leading-none text-slate-700'
            >
              {t('backToScenarios')}
            </button>
          </div>
        </div>

        <div className='h-1.5 w-full bg-gradient-to-r from-[rgba(20,68,145,0.3)] via-[#144491] to-[rgba(20,68,145,0.3)]' />
      </div>
    </div>
  );
}
