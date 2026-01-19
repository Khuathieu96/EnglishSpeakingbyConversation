import { ConversationList } from '@/components/ConversationList';
import { BrowserWarning } from '@/components/BrowserWarning';
import { conversations } from '@/data/conversations';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            🎤 English Speaking Practice
          </h1>
          <p className="text-lg text-gray-600">
            Choose a conversation to practice your English speaking skills
          </p>
        </div>

        {/* Browser Warning */}
        <BrowserWarning />

        {/* Conversation List */}
        <ConversationList conversations={conversations} />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Practice speaking English through interactive AI-guided conversations</p>
          <p className="mt-2">Best experienced in Google Chrome or Microsoft Edge</p>
        </footer>
      </div>
    </main>
  );
}
