import { Request, Response } from 'express';

import { conversations } from '../db-data';
import { logger } from '../logger';
import { ChatMessage } from '../models/chat-message.model';
import { DEFAULT_PROMPT_ID, getSystemPromptById } from '../prompts';
import { getAiCompletion } from '../services/ai-completion.service';

export async function startConversationRoute(request: Request, response: Response) {
  const userId = request.userId as string;
  const message = request.body?.message;

  if (typeof message !== 'string' || !message.trim()) {
    logger.warn({ body: request.body }, 'Rejected start-conversation request with invalid body.');
    response.status(400).json({ message: 'A "message" is required.' });
    return;
  }

  const promptId = DEFAULT_PROMPT_ID;
  const systemPrompt = getSystemPromptById(promptId);

  if (!systemPrompt) {
    logger.error({ promptId }, 'Default system prompt is not registered; refusing to start a conversation.');
    response.status(500).json({ message: 'The server is not configured correctly.' });
    return;
  }

  const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: message };

  let aiReply: string;

  try {
    aiReply = await getAiCompletion([
      { id: 'system-prompt', role: 'system', content: systemPrompt.content },
      userMessage,
    ]);
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

  const conversationId = crypto.randomUUID();

  conversations.push({
    id: conversationId,
    title: message,
    promptId,
    userId,
    messages: [userMessage, assistantMessage],
  });

  logger.info({ conversationId, promptId, userId }, 'Started a new conversation.');

  response.json({ conversationId, message: aiReply });
}
