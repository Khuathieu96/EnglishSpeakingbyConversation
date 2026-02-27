'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ConversationLine } from '@/types';

interface ScriptHintProps {
  line: ConversationLine;
}

export function ScriptHint({ line }: ScriptHintProps) {
  const t = useTranslations('hint');
  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
      <div className='text-xs font-medium text-blue-700 mb-2'>
        {t('yourLine')}
      </div>
      <p className='text-base text-blue-900 font-medium'>
        &quot;{line.text}&quot;
      </p>
      {line.hint && (
        <p className='text-sm text-blue-600 mt-2 italic'>
          {t('hint', { hint: line.hint })}
        </p>
      )}
    </div>
  );
}
