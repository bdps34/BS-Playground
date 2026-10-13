import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';

import { StartConversationResponse } from '../models/start-conversation-response.model';
import { AuthService } from '../../../core/auth/auth.service';
import { ChatHistoryService } from '../services/chat-history.service';
import { ConversationService } from '../services/conversation.service';
import { UserProfileService } from '../../../core/auth/user-profile.service';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let element: HTMLElement;
  let chatHistoryService: {
    getAllConversations: Mock<ChatHistoryService['getAllConversations']>;
    getConversationById: Mock<ChatHistoryService['getConversationById']>;
  };
  let conversationService: {
    startConversation: Mock<ConversationService['startConversation']>;
    continueConversation: Mock<ConversationService['continueConversation']>;
  };
  let authService: { logout: Mock<AuthService['logout']> };
  let userProfileService: UserProfileService;

  beforeEach(async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    chatHistoryService = {
      getAllConversations: vi.fn().mockResolvedValue([{ id: 'conv-1', title: 'Earlier chat' }]),
      getConversationById: vi.fn(),
    };
    conversationService = { startConversation: vi.fn(), continueConversation: vi.fn() };
    authService = { logout: vi.fn().mockResolvedValue(undefined) };

    TestBed.configureTestingModule({
      providers: [
        { provide: ChatHistoryService, useValue: chatHistoryService },
        { provide: ConversationService, useValue: conversationService },
        { provide: AuthService, useValue: authService },
      ],
    });

    userProfileService = TestBed.inject(UserProfileService);
    vi.spyOn(userProfileService, 'clear');

    fixture = TestBed.createComponent(Home);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function openSidebar() {
    element.querySelector<HTMLButtonElement>('button[aria-label="Expand sidebar"]')!.click();
    await fixture.whenStable();
  }

  function historyTitles() {
    return Array.from(element.querySelectorAll('.chat-history__item')).map((item) =>
      item.textContent?.trim()
    );
  }

  async function sendMessage(text: string) {
    const field = element.querySelector<HTMLInputElement>('chat-input input')!;
    field.value = text;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();
  }

  function messageTexts() {
    return Array.from(element.querySelectorAll('.chat-conversation__bubble')).map((bubble) =>
      bubble.textContent?.trim()
    );
  }

  it('starts on the initial state and loads the chat history', async () => {
    expect(element.querySelector('chat-initial-state')).not.toBeNull();

    await openSidebar();

    expect(historyTitles()).toEqual(['Earlier chat']);
  });

  it('starts a new conversation, waits for the reply and adds it to the history', async () => {
    let resolveReply!: (response: StartConversationResponse) => void;
    conversationService.startConversation.mockReturnValue(
      new Promise((resolve) => (resolveReply = resolve))
    );

    await sendMessage('Hello');

    expect(conversationService.startConversation).toHaveBeenCalledWith('Hello');
    expect(messageTexts()).toEqual(['Hello']);
    expect(element.querySelector('.chat-conversation__loading')).not.toBeNull();

    resolveReply({ conversationId: 'conv-2', message: 'Hi! How can I help?' });
    await vi.waitFor(() => expect(messageTexts()).toEqual(['Hello', 'Hi! How can I help?']));
    expect(element.querySelector('.chat-conversation__loading')).toBeNull();

    await openSidebar();
    expect(historyTitles()).toEqual(['Hello', 'Earlier chat']);
  });

  it('shows a failure reply when the AI request fails', async () => {
    conversationService.startConversation.mockRejectedValue(new Error('Network error'));

    await sendMessage('Hello');

    await vi.waitFor(() =>
      expect(messageTexts()).toEqual([
        'Hello',
        'Sorry, something went wrong while contacting the AI. Please try again.',
      ])
    );
  });

  it('continues an existing conversation', async () => {
    chatHistoryService.getConversationById.mockResolvedValue({
      id: 'conv-1',
      title: 'Earlier chat',
      messages: [{ id: 'msg-1', role: 'user', content: 'Earlier question' }],
    });
    conversationService.continueConversation.mockResolvedValue({ message: 'Follow-up answer' });

    await openSidebar();
    element.querySelector<HTMLButtonElement>('.chat-history__item')!.click();
    await vi.waitFor(() => expect(messageTexts()).toEqual(['Earlier question']));

    await sendMessage('Follow-up');

    expect(conversationService.continueConversation).toHaveBeenCalledWith('conv-1', 'Follow-up');
    await vi.waitFor(() =>
      expect(messageTexts()).toEqual(['Earlier question', 'Follow-up', 'Follow-up answer'])
    );
  });

  it('returns to the initial state on New Chat', async () => {
    conversationService.startConversation.mockResolvedValue({
      conversationId: 'conv-2',
      message: 'Reply',
    });
    await sendMessage('Hello');
    expect(element.querySelector('chat-conversation')).not.toBeNull();

    element.querySelector<HTMLButtonElement>('button[aria-label="New Chat"]')!.click();
    await fixture.whenStable();

    expect(element.querySelector('chat-initial-state')).not.toBeNull();
  });

  it('logs out and clears the user profile', async () => {
    element.querySelector<HTMLButtonElement>('button[aria-label="Logout"]')!.click();

    await vi.waitFor(() => expect(userProfileService.clear).toHaveBeenCalled());
    expect(authService.logout).toHaveBeenCalled();
  });
});
