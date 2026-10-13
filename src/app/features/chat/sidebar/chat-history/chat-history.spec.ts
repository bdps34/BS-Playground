import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHistory } from './chat-history';

describe('ChatHistory', () => {
  let fixture: ComponentFixture<ChatHistory>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ChatHistory);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('conversations', [
      { id: 'conv-1', title: 'First chat' },
      { id: 'conv-2', title: 'Second chat' },
    ]);
    await fixture.whenStable();
  });

  function itemButtons() {
    return Array.from(element.querySelectorAll<HTMLButtonElement>('.chat-history__item'));
  }

  it('renders one button per conversation', () => {
    expect(itemButtons().map((button) => button.textContent?.trim())).toEqual([
      'First chat',
      'Second chat',
    ]);
  });

  it('marks the selected conversation as current', async () => {
    fixture.componentRef.setInput('selectedId', 'conv-2');
    await fixture.whenStable();

    const [first, second] = itemButtons();
    expect(first.getAttribute('aria-current')).toBeNull();
    expect(second.getAttribute('aria-current')).toBe('true');
    expect(second.classList).toContain('chat-history__item--active');
  });

  it('emits the conversation id when a conversation is clicked', () => {
    const selectedSpy = vi.fn();
    fixture.componentInstance.conversationSelected.subscribe(selectedSpy);

    itemButtons()[1].click();

    expect(selectedSpy).toHaveBeenCalledWith('conv-2');
  });
});
