export default function ScenariosPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0e191b] dark:text-gray-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center p-4 pb-3 justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">mic</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">Practice English</h2>
          </div>
          <button className="flex items-center justify-center rounded-full w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">account_circle</span>
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-extrabold mb-1">Where to today?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Choose a scenario to start your AI practice session.</p>
        </div>
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-4">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-6 text-white shadow-md shadow-primary/20">
            <span className="text-sm font-semibold">All</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 transition-all active:scale-95">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Beginner</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 transition-all active:scale-95">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Intermediate</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 transition-all active:scale-95">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Advanced</span>
          </button>
        </div>
        <div className="px-4 pb-4">
          <h3 className="text-lg font-bold leading-tight tracking-tight mb-4">Conversation Scenarios</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfWkkR3sl5_48VqaeuyeuXCKAO5cIe7Opg4rH9DLdvfWp18YB9YnjkD8d5GdLe3URQ6wvgNBZUERQ4ETBr3bReqi8O7SyZrVKHwQ4WRenftkeaU0_7GIONhpTinxtaJM1CbiXWpfFr9LLHOIpSyIj1MCRb14vUDLx_gZxZzTB-FkChxnN8BoNzbvVn1ysN8xbMqXAaFvj-1H9RR_ZgMwoDSbDLsn8PJMD1lMFeOfyMsmLS2ypKUaTFttGqG7E8DKzGMfQ9QzpJ2UrX")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Beginner</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Dining</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">5m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Restaurant Order</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Practice ordering food, asking for recommendations, and handling the check.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2h8Zs7rNcb9pSYTYDo-yH-Ompw_XGQTPSpoqPYla3s_suRbsHGrKhZKpKGuEEPsp_7_2HGiWj5gU3NwqER_ro58Atdb7mgMJipq9IYDMIZG6WiuIK6WfmQAwCz7k9Ll3QmiJ4l7BTEN_s1MDF2z5sELrUxhbpciXH0j7nGK1PzZEjU9KHfr1TixK5v0al34Kk249VcoIcyd9w1-jYWoYsK35VB0G2JvSDfOsOjfDoeriEyM0PdqcoDVXqOgTnGVsBpcjcVZ5TDI0T")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Beginner</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Social</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">4m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Meeting New People</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Learn natural introductions, ice-breakers, and basic small talk for social events.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2WTqz4PmE5mUdmAy1ROhg6AlU_mFQNung0YEahNEZwRhwIkOI2C6xC8ZA4N-Z_z53UITMG_pXvO1Fsh8dhKe7hLaijrYAuoBLe22evlLVfFPmunqrv-_6-Ur1Q0bPpKjtEL9BjoqI35gG6mXOrlgrB7U-0sqwEagrh1wDdASrqCC9DU3VgHRU803UvYVq6R-_KyEBy-J3Ycbb4YGJ_n05-Kzcvfsj6GN-EXLeToa1kMRKM22BeGpc6n4oFf95SsN-rNJBWxBtHFbl")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Beginner</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Shopping</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">4m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Shopping at the Store</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Ask for prices, sizes, and find specific items while browsing a local shop.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSihMHc0Q7VVVRz1_1CPcEG6iPEM9EnTU2U8heDVwW31E17ccjCilNdFoa488xZRJTITHwhNJbg0YB535202kurctf__NzkYDAx4XnOR_gdmUQu_E7eVychhCHuBjFHiv5NHWQOSEIvvsXMoW7gEn3CEtO-DLPeJlXUrnsl21fEMWbF1x3_FUeWOcLMqNXDlv3xktOEwM3QQoTj4asQ1MHAo36ZWPUDvyMlggGtBwPpR_qwyur0WKc250c1lt-Ose--xymX6DAy1Ct")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Intermediate</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Travel</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">6m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">At the Airport</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Navigate check-in, customs, and boarding announcements with confidence.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-konOb0FtFBj7kXyasb8pk8Ei1T9E4H2_xBkcxj_Xyx6w79CYBwWCuZpp_LU_FnokjLxxLuSCbXOcGOBRjJ_7GNK-d7kmyWhnkjQjGAVZGud9E6OkX67Whi9HcXYQaFuN-OQi47NDhOFFtZeg86g3mjt8NdnFXBZLkVpxFoKZZbHmegbGSOynoTuFJ25zpbmIkMrPyKNJmytUnwk0sbWT4AktFaiVn69UwDkfV6qNWzfcs37aAAXJE01aeabIt45-JbXmR_HttImd")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Intermediate</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Healthcare</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">5m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Doctor Visit</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Explain symptoms, understand medical advice, and ask about treatments.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfcu-OiS8aTb7RWCiQ2TQT1qkG5qjKxPI5ROpFNprMZOT2fGz_mscoDJE4nefcy9wfistrnIrz7BfywjyvwI-jupzYYywIkxCmlw-4sd9FMu71pYyDboWzrek6kgXFIVzrTUnb-edBcT4AWTSdB5IyVAmMYGX5GJdAwiNekd6zP2iA2wilFln4y1ouApPLz-fwy6uvncyKyGTC_AGtDqJqbKaRKTQjPVxfseA5WyFmFNTnZc2VDiJ5IAkXo_N3H-bADiJGWMujiieM")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Intermediate</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Travel</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">5m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Hotel Check-in</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Manage your reservation, request amenities, and report room issues.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgb3BwlUTACd2jJobRAu4Ii-Vdgi7xP8I0Bk5UWUNtTqDwE03wO-UgVALFypZ9C_dIX6siGYoGPDf-Hw5BgN653VZg_sdOZOS5jZ_h-jQMJgVyijNG68sN2ZGarvpGlfOf1bWZJ8GRR393t-U8O62Ipz6hYm9BdFAqrr1vZb1S5MHWOUNqfsStRwYwAxD5ER2whWPiMG3fw8e40X9BaJp0YnQN0YBmBmSEgAeNJSLWDYfwOfO-n5n0Neh9td74GhZlDaxi-H3wuYRE")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Advanced</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Professional</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">8m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Job Interview</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Master professional vocabulary and answer complex behavioral questions.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAO-HPgTIRVFk7aWG7VQLOc_NDNLkf7XU4VrKijcm94vZbRROsaq9IxftpI33kL0mQLumzKX-2NF2NeX_eQgRCdrYFvRAg-DsDhcbVQEN7kik1ABelfDcy_bhsNJ3K6-lZlRsX5SmHBYfqZIk2YyXs-kelrvKJ8iWHWMAk0KgLST_mBBP_VxTAYwa283H98SjusOo9DAK51brd90PMbXBFck8aPj6Qmsbnx3PH9fsMtF7BeZEAwDOwji_vgVkTjmy-jS0jsWEO90N3O")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Advanced</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Professional</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">7m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Business Negotiation</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Practice persuasive speaking, counter-offers, and closing formal deals.</p>
              </div>
            </div>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:ring-2 active:ring-primary/50 transition-all">
              <div className="relative h-44 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAi8S83oRAfXxZc1hUeHGoC0__-GxGW2i0OhR-fUAU4WC04khGkX7xLB3KNWafj9NTmUVGfbjohp8vVan8u3yjvaeSGpy8ODDgKSAVgW3kYU0AltW8ud3pyM2ElV6jyr3HAZ5Z1YRgR-aMjRj8ZnPutmixW6BxzprfCGYSFvmWPyVPuvuraXRqeVEMUlQaq7BoI_aVsLurqr48zuZxMdGAxcUl1YqQH016Q9DE9defPVyNUt8CydXTNpnT9k9XqpCuFs00wQXK5oOYD")'}}>
                <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-yellow-500 text-xs fill-1" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Advanced</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Technology</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                    <span className="text-[11px] font-semibold">6m</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Technical Support Call</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">Describe hardware/software issues and follow complex technical instructions.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center max-w-md mx-auto rounded-t-3xl shadow-2xl">
        <a className="flex flex-col items-center gap-1 group" href="#">
          <div className="text-primary flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Home</p>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 group" href="#">
          <div className="flex h-8 items-center justify-center active:text-primary">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Progress</p>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 group" href="#">
          <div className="flex h-8 items-center justify-center active:text-primary">
            <span className="material-symbols-outlined">social_leaderboard</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Ranking</p>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 group" href="#">
          <div className="flex h-8 items-center justify-center active:text-primary">
            <span className="material-symbols-outlined">settings</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Settings</p>
        </a>
      </nav>
    </div>
  );
}
