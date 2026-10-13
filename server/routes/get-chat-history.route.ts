import { Request, Response } from 'express';

import { conversations } from '../db-data';
import { logger } from '../logger';
import { ChatHistorySummary } from '../models/chat-history-summary.model';

export function getChatHistoryRoute(request: Request, response: Response) {
  const userId = request.userId as string;

  const summaries: ChatHistorySummary[] = conversations
    .filter((conversation) => conversation.userId === userId)
    .map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
    }));

  logger.info({ userId, count: summaries.length }, 'Returned chat history summaries.');

  response.json(summaries);
}
