'use client';

import Link from 'next/link';
import { dashboardAssets } from './assets';

export function Footer() {
  return (
    <footer className='border-t border-slate-200 py-10 mt-12'>
      <div className='max-w-[1200px] mx-auto px-6 lg:px-10'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='flex items-center gap-3 opacity-70'>
            <div className='bg-slate-400 rounded-2xl w-8 h-8 flex items-center justify-center'>
              <img
                src={dashboardAssets.footerLogo}
                alt=''
                className='w-4 h-4'
                aria-hidden='true'
              />
            </div>
            <span className='text-slate-600 font-bold'>FluentSpeak</span>
          </div>

          <div className='flex items-center gap-8'>
            <Link
              href='/privacy'
              className='text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors'
            >
              Terms of Service
            </Link>
            <Link
              href='/help'
              className='text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors'
            >
              Help Center
            </Link>
          </div>

          <p className='text-sm text-slate-400'>
            © 2024 FluentSpeak Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
