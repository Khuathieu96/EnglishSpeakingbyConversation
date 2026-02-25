export default function SummaryPage() {
  return (
    <div className='bg-background-light dark:bg-background-dark text-[#0e191b] dark:text-white transition-colors duration-300'>
      <div className='relative flex h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark'>
        <div className='flex items-center p-4 pb-2 justify-between'>
          <button className='text-[#0e191b] dark:text-white flex size-12 shrink-0 items-center justify-start'>
            <span className='material-symbols-outlined'>close</span>
          </button>
          <h2 className='text-[#0e191b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12'>
            Session Summary
          </h2>
        </div>
        <div className='flex-1 overflow-y-auto pb-32'>
          <div className='px-4 pt-6 pb-2 text-center'>
            <div className='inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4'>
              <span className='material-symbols-outlined text-primary text-5xl'>
                celebration
              </span>
            </div>
            <h1 className='text-[#0e191b] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight'>
              Congratulations!
            </h1>
            <p className='text-[#0e191b]/70 dark:text-white/70 text-base mt-2'>
              Great job, Alex! You've successfully completed this practice
              session.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4 p-4'>
            <div className='flex flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-[#2d3139] shadow-sm'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='material-symbols-outlined text-primary text-lg'>
                  check_circle
                </span>
                <p className='text-[#0e191b]/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider'>
                  Lines
                </p>
              </div>
              <p className='text-[#0e191b] dark:text-white tracking-tight text-2xl font-bold'>
                10/10
              </p>
            </div>
            <div className='flex flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-[#2d3139] shadow-sm'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='material-symbols-outlined text-primary text-lg'>
                  star
                </span>
                <p className='text-[#0e191b]/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider'>
                  Perfect
                </p>
              </div>
              <p className='text-[#0e191b] dark:text-white tracking-tight text-2xl font-bold'>
                7
              </p>
            </div>
            <div className='flex flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-[#2d3139] shadow-sm'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='material-symbols-outlined text-primary text-lg'>
                  history
                </span>
                <p className='text-[#0e191b]/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider'>
                  Retries
                </p>
              </div>
              <p className='text-[#0e191b] dark:text-white tracking-tight text-2xl font-bold'>
                5
              </p>
            </div>
            <div className='flex flex-col items-center justify-center gap-1 rounded-xl p-5 border-2 border-primary bg-white dark:bg-[#2d3139] shadow-md relative overflow-hidden'>
              <div className='absolute -right-2 -bottom-2 opacity-5'>
                <span className='material-symbols-outlined text-8xl'>
                  insights
                </span>
              </div>
              <p className='text-primary text-xs font-black uppercase tracking-widest mb-1 z-10'>
                Match Score
              </p>
              <div className='relative flex items-center justify-center z-10'>
                <svg className='w-16 h-16 transform -rotate-90'>
                  <circle
                    className='text-primary/10'
                    cx='32'
                    cy='32'
                    fill='transparent'
                    r='28'
                    stroke='currentColor'
                    stroke-width='6'
                  ></circle>
                  <circle
                    className='text-primary'
                    cx='32'
                    cy='32'
                    fill='transparent'
                    r='28'
                    stroke='currentColor'
                    stroke-dasharray='175.9'
                    stroke-dashoffset='22.8'
                    stroke-width='6'
                  ></circle>
                </svg>
                <span className='absolute text-lg font-black text-[#0e191b] dark:text-white'>
                  87%
                </span>
              </div>
            </div>
          </div>
          <div className='px-4 pt-4'>
            <h3 className='text-[#0e191b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3'>
              Review your recording
            </h3>
            <div className='bg-white dark:bg-[#2d3139] rounded-xl p-5 shadow-sm border border-black/5 dark:border-white/5'>
              <div className='flex items-center gap-4 mb-4'>
                <button className='size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30'>
                  <span className='material-symbols-outlined text-3xl'>
                    play_arrow
                  </span>
                </button>
                <div className='flex-1'>
                  <p className='text-sm font-bold text-[#0e191b] dark:text-white leading-tight'>
                    Practice Session #42
                  </p>
                  <p className='text-xs text-[#0e191b]/50 dark:text-white/50'>
                    2 mins 14 secs • English Conversation
                  </p>
                </div>
              </div>
              <div className='flex items-end justify-between h-12 w-full px-1'>
                <div className='waveform-bar h-4'></div>
                <div className='waveform-bar h-6'></div>
                <div className='waveform-bar h-8'></div>
                <div className='waveform-bar h-5'></div>
                <div className='waveform-bar h-10'></div>
                <div className='waveform-bar h-12'></div>
                <div className='waveform-bar h-7'></div>
                <div className='waveform-bar h-9'></div>
                <div className='waveform-bar h-6'></div>
                <div className='waveform-bar h-4'></div>
                <div className='waveform-bar h-5'></div>
                <div className='waveform-bar h-8'></div>
                <div className='waveform-bar h-11'></div>
                <div className='waveform-bar h-6'></div>
                <div className='waveform-bar h-4'></div>
                <div className='waveform-bar h-7'></div>
                <div className='waveform-bar h-9 inactive'></div>
                <div className='waveform-bar h-10 inactive'></div>
                <div className='waveform-bar h-6 inactive'></div>
                <div className='waveform-bar h-8 inactive'></div>
                <div className='waveform-bar h-5 inactive'></div>
                <div className='waveform-bar h-4 inactive'></div>
                <div className='waveform-bar h-3 inactive'></div>
                <div className='waveform-bar h-5 inactive'></div>
                <div className='waveform-bar h-7 inactive'></div>
                <div className='waveform-bar h-8 inactive'></div>
                <div className='waveform-bar h-6 inactive'></div>
                <div className='waveform-bar h-4 inactive'></div>
              </div>
              <div className='flex justify-between mt-2'>
                <span className='text-[10px] font-bold text-primary'>0:45</span>
                <span className='text-[10px] font-bold text-[#0e191b]/40 dark:text-white/40'>
                  2:14
                </span>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <div
              className='w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-primary/5 rounded-xl min-h-[140px] border border-primary/10 relative'
              data-alt='Two people having a friendly conversation in a bright cafe'
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCOifsZORpQX1P8lDxWPSmQj-CRgmbwOKQjO2ayBWNX473szFnikysbjlVycxAeXwj5hObIJgK69cmfMcA4K1wIdQmuqsa9fwRXxE6clv018U61ARQAcCU4ulnMJ5ZMoHo0T_5YBKIp-PwoZPZzuZcGEEoAcoYnp_O3vnIY--Tth5xIrS8byBSIaF6fCt2uXous-ZInRkmNlZtpnKIdvj1a-hVwE0h6NYTORUG4K1npjXxkL0oLspkwRcxNPZG63jDgAfEJn2mxhJi")',
              }}
            >
              <div className='absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent'></div>
              <div className='relative p-4'>
                <p className='text-white text-sm font-bold'>
                  Keep the momentum going!
                </p>
                <p className='text-white/80 text-xs'>
                  Consistent practice is the key to fluency.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex flex-col gap-3 pb-8'>
          <button className='w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95'>
            <span className='material-symbols-outlined'>refresh</span>
            Restart Session
          </button>
          <button className='w-full bg-white dark:bg-[#2d3139] text-[#0e191b] dark:text-white font-bold py-4 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-center gap-2 transition-transform active:scale-95'>
            <span className='material-symbols-outlined'>dashboard</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
