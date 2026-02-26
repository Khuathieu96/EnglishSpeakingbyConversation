'use client';

import Link from 'next/link';
import { dashboardAssets } from './assets';

export function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-[6px] bg-[rgba(250,248,244,0.8)] border-b border-slate-200/60'>
      <div className='max-w-[1200px] mx-auto px-6 lg:px-10'>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary rounded-3xl w-10 h-10 flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,209,174,0.2),0px_4px_6px_-4px_rgba(0,209,174,0.2)]'>
              <img
                src={dashboardAssets.headerLogo}
                alt='FluentSpeak logo'
                className='w-[22px] h-5'
              />
            </div>
            <span className='text-xl font-bold text-slate-800 tracking-[-0.5px]'>
              FluentSpeak
            </span>
          </div>

          <nav className='hidden md:flex items-center gap-10'>
            <Link
              href='/dashboard'
              className='text-sm font-semibold text-primary'
            >
              Home
            </Link>
            <Link
              href='/scenarios'
              className='text-sm font-semibold text-slate-600 hover:text-primary transition-colors'
            >
              Scenarios
            </Link>
            <Link
              href='/progress'
              className='text-sm font-semibold text-slate-600 hover:text-primary transition-colors'
            >
              Progress
            </Link>
          </nav>

          <div className='flex items-center gap-6'>
            <Link
              href='/scenarios'
              className='bg-primary hover:bg-primary/90 text-slate-900 font-bold px-6 py-2.5 rounded-3xl shadow-[0px_4px_6px_-1px_rgba(0,209,174,0.1),0px_2px_4px_-2px_rgba(0,209,174,0.1)] transition-all'
            >
              Start Learning
            </Link>
            <div className='w-10 h-10 rounded-full border-2 border-primary/30 p-1'>
              <div className='w-full h-full rounded-full overflow-hidden'>
                <img
                  src={dashboardAssets.avatar}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
