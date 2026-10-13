import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conversation } from '../models/conversation.model';
import { ChatConversation } from './chat-conversation';

const CONVERSATION: Conversation = {
  id: 'conv-1',
  title: 'Greeting',
  messages: [
    { id: 'msg-1', role: 'user', content: 'Hi' },
    { id: 'msg-2', role: 'assistant', content: 'Hello! How can I help?' },
  ],
};

describe('ChatConversation', () => {
  let fixture: ComponentFixture<ChatConversation>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ChatConversation);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('conversation', CONVERSATION);
    await fixture.whenStable();
  });

  it('renders each message with its role', () => {
    const messages = Array.from(element.querySelectorAll('.chat-conversation__message'));

    expect(messages.map((message) => message.textContent?.trim())).toEqual([
      'Hi',
      'Hello! How can I help?',
    ]);
    expect(messages[0].classList).toContain('chat-conversation__message--user');
    expect(messages[1].classList).toContain('chat-conversation__message--assistant');
  });

  it('does not show the waiting status by default', () => {
    expect(element.querySelector('.chat-conversation__loading')).toBeNull();
    expect(element.querySelector<HTMLInputElement>('chat-input input')!.disabled).toBe(false);
  });

  it('shows the elapsed time and disables the input while awaiting a reply', async () => {
    fixture.componentRef.setInput('isAwaitingReply', true);
    fixture.componentRef.setInput('elapsedSeconds', 7);
    await fixture.whenStable();

    expect(element.querySelector('[role="status"]')?.textContent).toContain('7 seconds');
    expect(element.querySelector<HTMLInputElement>('chat-input input')!.disabled).toBe(true);
  });

  it('forwards a message submitted in the chat input', () => {
    const submitSpy = vi.fn();
    fixture.componentInstance.submitMessage.subscribe(submitSpy);
    const field = element.querySelector<HTMLInputElement>('chat-input input')!;

    field.value = 'Tell me more';
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(submitSpy).toHaveBeenCalledWith('Tell me more');
  });
});
