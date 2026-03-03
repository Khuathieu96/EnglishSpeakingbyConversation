'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import sampleStyles from './CompletionPopup.module.css';

interface CompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: {
    totalSentences: number;
    completedSentences: number;
    retries: number;
    fluency: number;
  };
  onListenUserTrack?: () => void;
  onListenFullDialogue?: () => void;
  isListeningUserTrack?: boolean;
  isListeningFullDialogue?: boolean;
  onPracticeAgain?: () => void;
  onBackToScenarios?: () => void;
}

export function CompletionPopup({
  isOpen,
  onClose,
  statistics,
  onListenUserTrack,
  onListenFullDialogue,
  isListeningUserTrack = false,
  isListeningFullDialogue = false,
  onPracticeAgain,
  onBackToScenarios,
}: CompletionPopupProps) {
  const t = useTranslations('completion');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) {
    return null;
  }

  const progressPercent = Math.max(0, Math.min(100, statistics.fluency));

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        backgroundColor: 'rgba(148, 153, 164, 0.92)',
        overflowY: 'auto',
        padding: '20px',
        isolation: 'isolate',
      }}
    >
      <div className='flex min-h-full items-center justify-center'>
        <section className={sampleStyles.dialog} aria-label='Completion dialog'>
          <div className={sampleStyles.iconShell}>
            <div className={sampleStyles.iconCircle}>
              <span className='material-symbols-outlined'>check</span>
            </div>
          </div>

          <h2 className={sampleStyles.title}>{t('wellDone')}</h2>
          <p className={sampleStyles.subtitle}>{t('finished')}</p>

          <div className={sampleStyles.statsGrid}>
            <article className={sampleStyles.statCard}>
              <span className={`material-symbols-outlined ${sampleStyles.statIcon}`}>
                chat
              </span>
              <p className={sampleStyles.statLabel}>{t('sentences')}</p>
              <p className={sampleStyles.statValue}>
                {statistics.completedSentences}/{statistics.totalSentences}
              </p>
            </article>

            <article className={sampleStyles.statCard}>
              <span className={`material-symbols-outlined ${sampleStyles.statIcon}`}>
                autorenew
              </span>
              <p className={sampleStyles.statLabel}>{t('retries')}</p>
              <p className={sampleStyles.statValue}>{statistics.retries}</p>
            </article>

            <article className={sampleStyles.statCard}>
              <span className={`material-symbols-outlined ${sampleStyles.statIcon}`}>
                flash_on
              </span>
              <p className={sampleStyles.statLabel}>{t('fluency')}</p>
              <p className={sampleStyles.statValue}>{statistics.fluency}%</p>
            </article>
          </div>

          <section className={sampleStyles.scorePanel}>
            <div className={sampleStyles.scoreHeader}>
              <span>{t('overallScore')}</span>
              <span>{t('excellent')}</span>
            </div>
            <div className={sampleStyles.scoreTrack}>
              <div className={sampleStyles.scoreFill} style={{ width: `${progressPercent}%` }} />
            </div>
          </section>

          {onListenUserTrack ? (
            <button
              type='button'
              className={sampleStyles.listenBtn}
              onClick={onListenUserTrack}
            >
              <span className='material-symbols-outlined'>volume_up</span>
              {isListeningUserTrack ? t('pause') : t('listenUserTrack')}
            </button>
          ) : null}

          {onListenFullDialogue ? (
            <button
              type='button'
              className={sampleStyles.listenBtn}
              onClick={onListenFullDialogue}
            >
              <span className='material-symbols-outlined'>graphic_eq</span>
              {isListeningFullDialogue ? t('pause') : t('listenFullDialogue')}
            </button>
          ) : null}

          <button type='button' className={sampleStyles.primaryBtn} onClick={onPracticeAgain ?? onClose}>
            <span className='material-symbols-outlined'>autorenew</span>
            {t('practiceAgain')}
          </button>

          <button type='button' className={sampleStyles.secondaryBtn} onClick={onBackToScenarios ?? onClose}>
            <span className='material-symbols-outlined'>library_books</span>
            {t('backToScenarios')}
          </button>

          <div className={sampleStyles.bottomLine} />
        </section>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
