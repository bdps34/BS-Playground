import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ChatHistorySummary } from '../models/chat-history-summary.model';
import { ChatMessage } from '../models/chat-message.model';
import { Conversation } from '../models/conversation.model';
import { ChatConversation } from '../chat/chat-conversation/chat-conversation';
import { ChatInitialState } from '../chat/chat-initial-state/chat-initial-state';
import { AuthService } from '../services/auth.service';
import { ChatHistoryService } from '../services/chat-history.service';
import { ConversationService } from '../services/conversation.service';
import { UserProfileService } from '../services/user-profile.service';
import { Sidebar } from '../sidebar/sidebar';

const FAILURE_REPLY_MESSAGE =
  'Sorry, something went wrong while contacting the AI. Please try again.';

@Component({
  selector: 'home',
  imports: [Sidebar, ChatInitialState, ChatConversation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private chatHistoryService = inject(ChatHistoryService);
  private conversationService = inject(ConversationService);
  private userProfileService = inject(UserProfileService);

  private replyIntervalId: ReturnType<typeof setInterval> | undefined;

  conversationSummaries = signal<ChatHistorySummary[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  awaitingReply = signal(false);
  elapsedSeconds = signal(0);

  constructor() {
    this.destroyRef.onDestroy(() => this.stopElapsedTimer());
    this.loadConversationSummaries();
  }

  async selectConversation(id: string) {
    try {
      const conversation = await this.chatHistoryService.getConversationById(id);
      this.selectedConversation.set(conversation);
    } catch (error) {
      console.error(`Failed to load conversation "${id}".`, error);
    }
  }

  startNewChat() {
    this.selectedConversation.set(null);
  }

  async logout() {
    await this.authService.logout();
    this.userProfileService.clear();
  }

  async sendMessage(message: string) {
    const existingConversation = this.selectedConversation();
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: message };

    if (existingConversation) {
      this.appendMessage(userMessage);
    } else {
      this.selectedConversation.set({
        id: crypto.randomUUID(),
        title: message,
        messages: [userMessage],
      });
    }

    this.startElapsedTimer();

    try {
      if (existingConversation) {
        const result = await this.conversationService.continueConversation(
          existingConversation.id,
          message
        );
        this.appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: result.message });
      } else {
        const result = await this.conversationService.startConversation(message);
        this.selectedConversation.update((conversation) =>
          conversation
            ? {
                ...conversation,
                id: result.conversationId,
                messages: [
                  ...conversation.messages,
                  { id: crypto.randomUUID(), role: 'assistant', content: result.message },
                ],
              }
            : conversation
        );
        this.conversationSummaries.update((summaries) => [
          { id: result.conversationId, title: message },
          ...summaries,
        ]);
      }
    } catch (error) {
      console.error('Failed to send message.', error);
      this.appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: FAILURE_REPLY_MESSAGE,
      });
    } finally {
      this.stopElapsedTimer();
    }
  }

  private async loadConversationSummaries() {
    try {
      const summaries = await this.chatHistoryService.getAllConversations();
      this.conversationSummaries.set(summaries);
    } catch (error) {
      console.error('Failed to load chat history.', error);
    }
  }

  private startElapsedTimer() {
    this.awaitingReply.set(true);
    this.elapsedSeconds.set(0);
    this.replyIntervalId = setInterval(() => {
      this.elapsedSeconds.update((seconds) => seconds + 1);
    }, 1000);
  }

  private stopElapsedTimer() {
    clearInterval(this.replyIntervalId);
    this.replyIntervalId = undefined;
    this.awaitingReply.set(false);
    this.elapsedSeconds.set(0);
  }

  private appendMessage(message: ChatMessage) {
    this.selectedConversation.update((conversation) =>
      conversation
        ? { ...conversation, messages: [...conversation.messages, message] }
        : conversation
    );
  }
}
