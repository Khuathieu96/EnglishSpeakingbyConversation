import React from 'react';
import { Conversation } from '@/types';
import { ConversationCard } from './ConversationCard';

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No conversations available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
