import React from 'react';
import Link from 'next/link';
import { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const renderStars = (difficulty: string) => {
    const starCount = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
    return (
      <div className="flex items-center">
        {Array.from({ length: starCount }).map((_, i) => (
          <span 
            key={i} 
            className="material-symbols-outlined text-yellow-500 text-xs fill-1" 
            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/chat/${conversation.id}`}>
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg active:ring-2 active:ring-primary/50 transition-all cursor-pointer">
        {/* Image Header */}
        <div 
          className="relative h-44 w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${conversation.thumbnail}")` }}
        >
          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 dark:border-gray-800">
            {renderStars(conversation.difficulty)}
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              {conversation.difficulty}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Category and Time */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {conversation.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
              <span className="text-[11px] font-semibold">{conversation.estimatedTime}m</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {conversation.title}
          </h4>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
            {conversation.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
