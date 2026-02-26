'use client';

import { useState } from 'react';
import { ScenarioCard } from './ScenarioCard';
import { dashboardAssets } from './assets';

const scenarios = [
  {
    id: 'meeting-people',
    title: 'Meeting New People',
    description: 'Basic greetings and introductions.',
    difficulty: 'beginner' as const,
    progress: 85,
    iconUrl: dashboardAssets.scenarios.meetingPeople.icon,
    imageUrl: dashboardAssets.scenarios.meetingPeople.image,
  },
  {
    id: 'restaurant-order',
    title: 'At a Restaurant',
    description: 'Ordering food and asking for the bill.',
    difficulty: 'beginner' as const,
    progress: 32,
    iconUrl: dashboardAssets.scenarios.restaurant.icon,
    imageUrl: dashboardAssets.scenarios.restaurant.image,
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    description: 'Practice high-stakes career conversations.',
    difficulty: 'intermediate' as const,
    progress: 0,
    iconUrl: dashboardAssets.scenarios.jobInterview.icon,
    imageUrl: dashboardAssets.scenarios.jobInterview.image,
  },
  {
    id: 'booking-flight',
    title: 'Booking a Flight',
    description: 'Handling travel logistics and issues.',
    difficulty: 'intermediate' as const,
    progress: 15,
    iconUrl: dashboardAssets.scenarios.bookingFlight.icon,
    imageUrl: dashboardAssets.scenarios.bookingFlight.image,
  },
];

type FilterType = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function ScenariosSection() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredScenarios =
    filter === 'all'
      ? scenarios
      : scenarios.filter((s) => s.difficulty === filter);

  return (
    <section className='flex flex-col gap-8'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-3xl font-bold text-slate-800 leading-[36px]'>
            Continue Your Journey
          </h2>
          <p className='text-slate-500 text-base leading-6'>
            Pick up where you left off or start a new challenge.
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`h-10 px-5 rounded-3xl text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-primary text-slate-900'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => setFilter('beginner')}
            className={`h-10 px-5 rounded-3xl text-sm font-medium transition-all ${
              filter === 'beginner'
                ? 'bg-primary text-slate-900'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={`h-10 px-5 rounded-3xl text-sm font-medium transition-all ${
              filter === 'intermediate'
                ? 'bg-primary text-slate-900'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`h-10 px-5 rounded-3xl text-sm font-medium transition-all ${
              filter === 'advanced'
                ? 'bg-primary text-slate-900'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {filteredScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} {...scenario} />
        ))}
      </div>
    </section>
  );
}
