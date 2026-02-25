import { ConversationList } from '@/components/ConversationList';
import { BrowserWarning } from '@/components/BrowserWarning';
import { conversations } from '@/data/conversations';

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0e191b] dark:text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-extrabold mb-1">Where to today?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Choose a scenario to start your AI practice session.
          </p>
        </div>

        {/* Browser Warning */}
        <div className="px-4 mb-4">
          <BrowserWarning />
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-lg font-bold leading-tight tracking-tight mb-4">
            Conversation Scenarios
          </h3>
          {/* Conversation List */}
          <ConversationList conversations={conversations} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center max-w-md mx-auto rounded-t-3xl shadow-2xl">
        <a className="flex flex-col items-center gap-1 group" href="#">
          <div className="text-primary flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
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
