export default function PracticePage() {
  return (
    <div className='bg-background-light dark:bg-background-dark font-display text-[#0e191b] dark:text-[#f8fbfb]'>
      <header className='sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md'>
        <div className='flex items-center p-4 pb-2 justify-between'>
          <div className='text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer'>
            <span className='material-symbols-outlined'>
              arrow_back_ios_new
            </span>
          </div>
          <h2 className='text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center'>
            Practice Session
          </h2>
          <div className='size-10 flex items-center justify-center text-primary'>
            <span className='material-symbols-outlined'>more_horiz</span>
          </div>
        </div>
        <div className='flex flex-col gap-2 px-6 py-2'>
          <div className='flex gap-6 justify-between items-end'>
            <p className='text-sm font-semibold text-primary uppercase tracking-wider'>
              At the Restaurant
            </p>
            <p className='text-xs font-medium opacity-70'>2 / 10 Phrases</p>
          </div>
          <div className='h-1.5 w-full rounded-full bg-primary/20'>
            <div
              className='h-1.5 rounded-full bg-primary'
              style={{ width: '20%' }}
            ></div>
          </div>
        </div>
      </header>
      <main className='flex flex-col w-full max-w-md mx-auto h-full px-4'>
        <div className='conversation-container flex flex-col gap-4 py-6 scroll-smooth'>
          <div className='flex items-end gap-3 max-w-[85%]'>
            <div className='bg-primary/10 aspect-square rounded-full w-8 shrink-0 flex items-center justify-center border border-primary/20 overflow-hidden'>
              <img
                className='w-full h-full object-cover'
                data-alt='AI Tutor Avatar'
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuAVolRtGdvy8GK1YfWX7fHDDHjWBFgdb9o7MxCc5ehk-lMxqrwglpUe9DfFczBLDVdRz1lGl_TP67P_gNCrqP_PniW9d4hUD4E0sNnT5O7dxOUlh5piPPYi4zTkXKWgFtmepJiSpSIotszLnkdfoI0pDyViRqNg4e-LVpUTGtHuK-kN-UJ0YWBfpfe9aBez7jNVPl64mjFubz_LHOwqJ2t0LoAuBLvLivRcwgvEz2EJFBElRp3NgprcNxGbc_vLHDxQcl-rH3WnM7Vp'
              />
            </div>
            <div className='flex flex-col gap-1 items-start'>
              <p className='text-primary text-[11px] font-bold uppercase tracking-tight ml-2'>
                AI Tutor
              </p>
              <div className='text-[15px] font-medium leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm text-[#0e191b] dark:text-gray-100'>
                Hello! Welcome to the café. What would you like to order today?
              </div>
            </div>
          </div>
          <div className='flex items-end gap-3 justify-end ml-auto max-w-[85%]'>
            <div className='flex flex-col gap-1 items-end'>
              <p className='text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-tight mr-2'>
                You
              </p>
              <div className='rounded-2xl rounded-br-none px-4 py-3 bg-primary text-white shadow-md'>
                <div className='text-[15px] font-medium border-b border-white/20 pb-2 mb-2'>
                  <span className='opacity-70 text-xs block mb-0.5'>
                    You said:
                  </span>
                  I have water please
                </div>
                <div className='text-[15px] font-medium'>
                  <span className='opacity-70 text-xs block mb-0.5'>
                    Expected:
                  </span>
                  I'll <span className='bg-white/20 px-1 rounded'>have</span>{' '}
                  water, please
                </div>
              </div>
            </div>
            <div className='bg-gray-300 dark:bg-gray-600 aspect-square rounded-full w-8 shrink-0 overflow-hidden'>
              <img
                className='w-full h-full object-cover'
                data-alt='User Avatar'
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuCgKWKFG7H5Rk369drFdxZXx4fwOQ8iBMJSJ0Qpc3Ra0ZF8f7d44ahTICOWYhJCfmk8t_-YFMVBdCo4UpJ4_yuird-X9xDfK919gVaNbA2_lofLO-z3h6Lvx8YDX7rk38mALW8OqK0xPFcgtbRrlTRgi3ITJvIqtBqFBZYwsJrmLYS38EkIgxVgm0efzgW3_-dSJvUvwM7fIVhEezLrE2ePvHl7RpMAwGak491cQXqvOu87NnzuSumtl4STSfB9Vt0ZXHUZeV1Leaj3'
              />
            </div>
          </div>
          <div className='flex items-end gap-3 max-w-[85%]'>
            <div className='bg-primary/10 aspect-square rounded-full w-8 shrink-0 flex items-center justify-center border border-primary/20 overflow-hidden'>
              <img
                className='w-full h-full object-cover'
                data-alt='AI Tutor Avatar'
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuBPTh7OanqsgkgldZVKm-A-iW2JN05V-3_wUwXv1JeM0ZacLM7bJshuXPnRTOmwirXJJDjgrFiUjJerlD_qWsFf2mL3NDwsMKnKFRuyIixsaOnajqTygTh9CrDM7-kLmlsdfKnbkJNiDiuHtwXewLCJhN7OzP7HlRTp8TL4ISYZNU10tI2jYv_vvgnEwNQCKGqG91qOb_wCdP_aEcKxxp7xwK4SbpZk_7XDXmVQbR9KDFAZrwKoID2LE-ttjV5ZGKhy_NX2vGE7cTzJ'
              />
            </div>
            <div className='flex flex-col gap-1 items-start'>
              <p className='text-primary text-[11px] font-bold uppercase tracking-tight ml-2'>
                AI Tutor
              </p>
              <div className='text-[15px] font-medium leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm text-[#0e191b] dark:text-gray-100'>
                Great! Anything else to drink?
              </div>
            </div>
          </div>
        </div>
        <div className='mt-auto pb-10 flex flex-col items-center'>
          <div className='w-full mb-8 relative'>
            <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest z-10'>
              Your Turn
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border-2 border-primary shadow-xl ring-4 ring-primary/5'>
              <h4 className='text-gray-400 text-xs font-bold uppercase tracking-widest mb-2'>
                Repeat this phrase
              </h4>
              <p className='text-2xl font-bold text-[#0e191b] dark:text-white'>
                "I'll have water, please"
              </p>
              <button className='mt-4 inline-flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80 transition-opacity'>
                <span className='material-symbols-outlined text-base'>
                  volume_up
                </span>
                Listen to pronunciation
              </button>
            </div>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <div className='relative group cursor-pointer'>
              <div className='pulsing-ring rounded-full'>
                <div className='bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform'>
                  <span className='material-symbols-outlined text-4xl leading-none'>
                    mic
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center gap-1'>
              <p className='text-primary font-bold animate-pulse text-sm'>
                Listening...
              </p>
              <p className='text-gray-500 dark:text-gray-400 text-xs font-medium'>
                Attempts: 3 remaining
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className='h-8 bg-background-light dark:bg-background-dark'></div>
    </div>
  );
}
