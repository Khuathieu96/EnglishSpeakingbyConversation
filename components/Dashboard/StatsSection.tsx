'use client';

import { dashboardAssets } from './assets';

interface StatsCardProps {
  iconUrl: string;
  value: string;
  label: string;
  color: 'teal' | 'indigo' | 'amber';
}

const colorStyles = {
  teal: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    iconBg: 'bg-primary',
    iconShadow: 'shadow-primary/20',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-500',
    iconShadow: 'shadow-indigo-500/20',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-500',
    iconShadow: 'shadow-amber-500/20',
  },
};

function StatsCard({ iconUrl, value, label, color }: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-3xl p-[33px] flex flex-col gap-4`}
    >
      <div
        className={`${styles.iconBg} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${styles.iconShadow}`}
      >
        <img src={iconUrl} alt='' className='w-5 h-5' aria-hidden='true' />
      </div>

      <div className='flex flex-col'>
        <span className='text-3xl font-bold text-slate-800 leading-9'>
          {value}
        </span>
        <span className='text-slate-600 font-semibold text-base leading-6'>
          {label}
        </span>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className='grid grid-cols-1 md:grid-cols-3 gap-6 pb-12'>
      <StatsCard
        iconUrl={dashboardAssets.stats.streak}
        value='12 Day'
        label='Learning Streak'
        color='teal'
      />
      <StatsCard
        iconUrl={dashboardAssets.stats.practiceTime}
        value='4.5 Hours'
        label='Practice Time'
        color='indigo'
      />
      <StatsCard
        iconUrl={dashboardAssets.stats.completedTasks}
        value='8 Scenarios'
        label='Completed Tasks'
        color='amber'
      />
    </section>
  );
}
