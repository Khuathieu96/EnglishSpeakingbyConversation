'use client';

import Link from 'next/link';
import { dashboardAssets } from './assets';

interface ScenarioCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  iconUrl: string;
  imageUrl: string;
}

const difficultyStyles = {
  beginner: 'bg-yellow-400 text-slate-900',
  intermediate: 'bg-rose-400 text-white',
  advanced: 'bg-purple-500 text-white',
};

const difficultyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function ScenarioCard({
  id,
  title,
  description,
  difficulty,
  progress,
  iconUrl,
  imageUrl,
}: ScenarioCardProps) {
  return (
    <Link href={`/chat/${id}`}>
      <div className='bg-white border border-slate-200 rounded-2xl p-[21px] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full min-h-[344px]'>
        <div className='relative mb-4'>
          <div className='h-[171px] rounded-[24px] overflow-hidden relative'>
            <img
              src={imageUrl}
              alt={title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-primary/10' />

            <div
              className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${difficultyStyles[difficulty]}`}
            >
              {difficultyLabels[difficulty]}
            </div>
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold text-slate-800 leading-7'>
              {title}
            </h3>
            <img src={iconUrl} alt='' className='w-5 h-5' aria-hidden='true' />
          </div>
          <p className='text-slate-500 text-sm leading-5 line-clamp-1'>
            {description}
          </p>
        </div>

        <div className='mt-4 pt-2'>
          <div className='flex items-center justify-between mb-1.5'>
            <span className='text-[11px] font-bold text-slate-400 uppercase tracking-tight'>
              Progress
            </span>
            {progress > 0 ? (
              <span className='text-[11px] font-bold text-primary'>
                {progress}%
              </span>
            ) : (
              <img
                src={dashboardAssets.progressLock}
                alt=''
                className='w-4 h-2'
                aria-hidden='true'
              />
            )}
          </div>
          <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary rounded-full transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
