import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInitialState } from './chat-initial-state';

describe('ChatInitialState', () => {
  let fixture: ComponentFixture<ChatInitialState>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ChatInitialState);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows the app title', () => {
    expect(element.querySelector('h1')?.textContent).toContain('BS Playground');
  });

  it('forwards a message submitted in the chat input', () => {
    const submitSpy = vi.fn();
    fixture.componentInstance.submitMessage.subscribe(submitSpy);
    const field = element.querySelector<HTMLInputElement>('chat-input input')!;

    field.value = 'Hello';
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(submitSpy).toHaveBeenCalledWith('Hello');
  });
});
