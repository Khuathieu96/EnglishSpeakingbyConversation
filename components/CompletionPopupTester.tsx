'use client';

import { useState } from 'react';
import { CompletionPopup } from '@/components/CompletionPopup';

export function CompletionPopupTester() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 1200,
          border: 'none',
          borderRadius: '999px',
          height: '46px',
          padding: '0 18px',
          fontSize: '14px',
          fontWeight: 700,
          background: 'var(--color-secondary)',
          color: '#fff',
          boxShadow: '0 10px 20px rgba(20, 68, 145, 0.28)',
          cursor: 'pointer',
        }}
      >
        Test Popup
      </button>

      <CompletionPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userName='Alex'
        statistics={{
          totalSentences: 6,
          completedSentences: 6,
          retries: 0,
          fluency: 85,
        }}
        onPracticeAgain={() => setIsOpen(false)}
        onBackToScenarios={() => setIsOpen(false)}
      />
    </>
  );
}
