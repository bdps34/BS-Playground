import { ChatMessage } from './chat-message.model';

export type Conversation = {
  id: string;
  title: string;
  promptId: string;
  userId: string;
  messages: ChatMessage[];
};
