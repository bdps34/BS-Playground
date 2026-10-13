import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Sidebar);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('conversations', [{ id: 'conv-1', title: 'First chat' }]);
    await fixture.whenStable();
  });

  function button(label: string) {
    return element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
  }

  it('starts collapsed, without the chat history', () => {
    expect(element.querySelector('.sidebar--collapsed')).not.toBeNull();
    expect(element.querySelector('chat-history')).toBeNull();
    expect(button('Expand sidebar')).not.toBeNull();
  });

  it('expands and collapses with the toggle button', async () => {
    button('Expand sidebar').click();
    await fixture.whenStable();

    expect(element.querySelector('.sidebar--collapsed')).toBeNull();
    expect(element.querySelector('chat-history')?.textContent).toContain('First chat');

    button('Collapse sidebar').click();
    await fixture.whenStable();

    expect(element.querySelector('chat-history')).toBeNull();
  });

  it('closes when the backdrop is clicked', async () => {
    button('Search in Chat').click();
    await fixture.whenStable();

    element.querySelector<HTMLElement>('.sidebar__backdrop')!.click();
    await fixture.whenStable();

    expect(element.querySelector('.sidebar--collapsed')).not.toBeNull();
  });

  it('emits newChat and logout', () => {
    const newChatSpy = vi.fn();
    const logoutSpy = vi.fn();
    fixture.componentInstance.newChat.subscribe(newChatSpy);
    fixture.componentInstance.logout.subscribe(logoutSpy);

    button('New Chat').click();
    button('Logout').click();

    expect(newChatSpy).toHaveBeenCalledOnce();
    expect(logoutSpy).toHaveBeenCalledOnce();
  });

  it('forwards a conversation selected in the history', async () => {
    const selectSpy = vi.fn();
    fixture.componentInstance.selectConversation.subscribe(selectSpy);
    button('Expand sidebar').click();
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('.chat-history__item')!.click();

    expect(selectSpy).toHaveBeenCalledWith('conv-1');
  });
});
