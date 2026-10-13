import { Request, Response } from 'express';

import { conversations } from '../db-data';
import { logger } from '../logger';
import { Conversation } from '../models/conversation.model';

export function getChatConversationRoute(request: Request, response: Response) {
  const userId = request.userId as string;
  const conversationId = request.params['id'];
  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation || conversation.userId !== userId) {
    logger.warn({ conversationId, userId }, 'Requested conversation was not found.');
    response.status(404).json({ message: `Conversation with id "${conversationId}" was not found.` });
    return;
  }

  const conversationWithoutSystemMessages: Conversation = {
    ...conversation,
    messages: conversation.messages.filter((message) => message.role !== 'system'),
  };

  logger.info(
    { conversationId, messageCount: conversationWithoutSystemMessages.messages.length },
    'Returned chat conversation.'
  );

  response.json(conversationWithoutSystemMessages);
}
