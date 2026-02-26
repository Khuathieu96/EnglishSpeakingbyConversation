'use client';

import Link from 'next/link';
import { dashboardAssets } from './assets';

export function HeroSection() {
  return (
    <section className='bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl relative'>
      <div className='absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.35),transparent_45%)]' />

      <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-[35px] px-8 lg:px-16 py-[61px]'>
        <div className='flex flex-col gap-6 w-full max-w-[488px]'>
          <div className='inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-[17px] py-[7px] w-full'>
            <div className='relative'>
              <div className='w-2 h-2 bg-primary rounded-full opacity-75' />
              <div className='absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping' />
            </div>
            <span className='text-primary text-xs font-bold uppercase tracking-widest'>
              New AI Scenario Live
            </span>
          </div>

          <h1 className='text-5xl lg:text-[60px] font-bold text-white leading-[60px] tracking-[-1.5px]'>
            Master English
            <br />
            through <span className='text-primary'>Real-</span>
            <br />
            <span className='text-primary'>World</span>
            <br />
            Conversations
          </h1>

          <p className='text-slate-300 text-lg leading-[29px] max-w-[448px]'>
            Stop memorizing rules. Start talking. Practice natural interactions
            in high-stakes environments designed for your success.
          </p>

          <div className='flex flex-wrap gap-4 pt-4'>
            <Link
              href='/scenarios'
              className='bg-primary hover:bg-primary/90 text-slate-900 font-bold text-lg px-8 py-4 rounded-3xl transition-all'
            >
              Get Started Free
            </Link>
            <button className='bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg px-8 py-4 rounded-3xl transition-all'>
              View Demo
            </button>
          </div>
        </div>

        <div className='relative flex-1 flex items-center justify-center'>
          <div className='relative rotate-3'>
            <div className='w-[380px] h-[380px] lg:w-[488px] lg:h-[488px] rounded-[24px] overflow-hidden shadow-2xl relative'>
              <img
                src={dashboardAssets.heroImage}
                alt='Learner practicing English conversation'
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
