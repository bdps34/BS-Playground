import { ChatMessage } from '../models/chat-message.model';

const COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

type CompletionResponseBody = {
  choices: { message: { content: string } }[];
};

export async function getAiCompletion(messages: ChatMessage[]) {
  const apiKey = process.env['OPENAI_API_KEY'];

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  const response = await fetch(COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.map((message) => ({ role: message.role, content: message.content })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI provider request failed with status ${response.status}: ${errorBody}`);
  }

  const body = (await response.json()) as CompletionResponseBody;
  const reply = body.choices[0]?.message?.content;

  if (!reply) {
    throw new Error('AI provider response did not include a message.');
  }

  return reply;
}
