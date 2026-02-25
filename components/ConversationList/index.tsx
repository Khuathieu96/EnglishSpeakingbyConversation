'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types';
import { ConversationCard } from './ConversationCard';

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredConversations = filter === 'all' 
    ? conversations 
    : conversations.filter(c => c.difficulty === filter);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No conversations available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-semibold transition-all ${
            filter === 'all' 
              ? 'bg-primary text-white shadow-md shadow-primary/20' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 active:scale-95'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('beginner')}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all ${
            filter === 'beginner' 
              ? 'bg-primary text-white shadow-md shadow-primary/20' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 active:scale-95'
          }`}
        >
          Beginner
        </button>
        <button 
          onClick={() => setFilter('intermediate')}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all ${
            filter === 'intermediate' 
              ? 'bg-primary text-white shadow-md shadow-primary/20' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 active:scale-95'
          }`}
        >
          Intermediate
        </button>
        <button 
          onClick={() => setFilter('advanced')}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all ${
            filter === 'advanced' 
              ? 'bg-primary text-white shadow-md shadow-primary/20' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 active:scale-95'
          }`}
        >
          Advanced
        </button>
      </div>

      {/* Conversation Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredConversations.map((conversation) => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
