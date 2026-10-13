import { Request, Response } from 'express';

import { conversations } from '../db-data';
import { logger } from '../logger';
import { ChatMessage } from '../models/chat-message.model';
import { getSystemPromptById } from '../prompts';
import { getAiCompletion } from '../services/ai-completion.service';

export async function continueConversationRoute(request: Request, response: Response) {
  const userId = request.userId as string;
  const conversationId = request.body?.conversationId;
  const message = request.body?.message;

  if (typeof conversationId !== 'string' || typeof message !== 'string' || !message.trim()) {
    logger.warn(
      { body: request.body },
      'Rejected continue-conversation request with invalid body.'
    );
    response.status(400).json({ message: 'Both "conversationId" and "message" are required.' });
    return;
  }

  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation || conversation.userId !== userId) {
    logger.warn({ conversationId, userId }, 'Conversation to continue was not found.');
    response
      .status(404)
      .json({ message: `Conversation with id "${conversationId}" was not found.` });
    return;
  }

  const systemPrompt = getSystemPromptById(conversation.promptId);

  if (!systemPrompt) {
    logger.error(
      { conversationId, promptId: conversation.promptId },
      'Conversation has no resolvable system prompt; refusing to contact the AI provider.'
    );
    response
      .status(500)
      .json({ message: 'This conversation is not configured correctly and cannot continue.' });
    return;
  }

  const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: message };
  const priorMessages = conversation.messages.filter((item) => item.role !== 'system');

  const messagesForCompletion: ChatMessage[] = [
    { id: 'system-prompt', role: 'system', content: systemPrompt.content },
    ...priorMessages,
    userMessage,
  ];

  let aiReply: string;

  try {
    aiReply = await getAiCompletion(messagesForCompletion);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get a response from the AI provider.');
    response.status(502).json({ message: 'Failed to get a response from the AI provider.' });
    return;
  }

  const assistantMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: aiReply,
  };

  conversation.messages.push(userMessage, assistantMessage);

  logger.info(
    { conversationId, messageCount: conversation.messages.length },
    'Continued an existing conversation.'
  );

  response.json({ message: aiReply });
}
