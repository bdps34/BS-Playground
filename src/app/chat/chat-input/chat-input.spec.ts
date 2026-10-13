import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';

import { ChatInput } from './chat-input';

describe('ChatInput', () => {
  let fixture: ComponentFixture<ChatInput>;
  let field: HTMLInputElement;
  let sendButton: HTMLButtonElement;
  let submitSpy: Mock<(message: string) => void>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ChatInput);
    submitSpy = vi.fn();
    fixture.componentInstance.submitMessage.subscribe(submitSpy);
    await fixture.whenStable();

    field = fixture.nativeElement.querySelector('input');
    sendButton = fixture.nativeElement.querySelector('button[aria-label="Send message"]');
  });

  async function type(text: string) {
    field.value = text;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  function pressEnter() {
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }

  it('disables the send button while the message is blank', async () => {
    expect(sendButton.disabled).toBe(true);

    await type('   ');
    expect(sendButton.disabled).toBe(true);

    await type('Hello');
    expect(sendButton.disabled).toBe(false);
  });

  it('emits the trimmed message on Enter and clears the field', async () => {
    await type('  Hello there  ');

    pressEnter();
    await fixture.whenStable();

    expect(submitSpy).toHaveBeenCalledWith('Hello there');
    expect(field.value).toBe('');
  });

  it('emits the message when the send button is clicked', async () => {
    await type('Hello');

    sendButton.click();

    expect(submitSpy).toHaveBeenCalledWith('Hello');
  });

  it('does not emit a blank message', async () => {
    await type('   ');

    pressEnter();

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('does not emit and disables the field while disabled', async () => {
    await type('Hello');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    pressEnter();

    expect(submitSpy).not.toHaveBeenCalled();
    expect(field.disabled).toBe(true);
    expect(sendButton.disabled).toBe(true);
  });
});
