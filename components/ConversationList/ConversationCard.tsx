import React from 'react';
import Link from 'next/link';
import { Conversation } from '@/types';
import { Card, CardBody } from '../ui/Card';

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Link href={`/chat/${conversation.id}`}>
      <Card hover className="h-full">
        <CardBody className="space-y-3">
          <div className="text-4xl mb-2">{conversation.thumbnail}</div>
          <h3 className="text-xl font-bold text-gray-900">{conversation.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{conversation.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                difficultyColors[conversation.difficulty]
              }`}
            >
              {conversation.difficulty.charAt(0).toUpperCase() + conversation.difficulty.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{conversation.estimatedTime} min</span>
          </div>
          <div className="text-xs text-gray-500 pt-1">
            {conversation.category}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
