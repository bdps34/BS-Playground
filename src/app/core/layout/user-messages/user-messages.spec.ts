import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessagesService } from '../../user-messages/user-messages.service';
import { UserMessages } from './user-messages';

describe('UserMessages', () => {
  let fixture: ComponentFixture<UserMessages>;
  let element: HTMLElement;
  let userMessagesService: UserMessagesService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserMessages);
    element = fixture.nativeElement;
    userMessagesService = TestBed.inject(UserMessagesService);
    await fixture.whenStable();
  });

  function items() {
    return Array.from(element.querySelectorAll('.user-messages__item'));
  }

  it('renders nothing when there are no messages', () => {
    expect(element.querySelector('.user-messages')).toBeNull();
  });

  it('renders each message with its type', async () => {
    userMessagesService.showError('Something failed');
    userMessagesService.showSuccess('Saved');
    await fixture.whenStable();

    const [error, success] = items();
    expect(error.textContent).toContain('Something failed');
    expect(error.classList).toContain('user-messages__item--error');
    expect(success.textContent).toContain('Saved');
    expect(success.classList).toContain('user-messages__item--success');
  });

  it('removes a message when it is dismissed', async () => {
    userMessagesService.showInfo('First');
    userMessagesService.showWarning('Second');
    await fixture.whenStable();

    items()[0].querySelector<HTMLButtonElement>('button[aria-label="Dismiss message"]')!.click();
    await fixture.whenStable();

    expect(items().map((item) => item.textContent?.trim())).toEqual(['Second']);
  });
});
