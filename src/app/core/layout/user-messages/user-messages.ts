import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserMessagesService } from '../../user-messages/user-messages.service';

@Component({
  selector: 'user-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-messages.html',
  styleUrl: './user-messages.scss',
})
export class UserMessages {
  private userMessagesService = inject(UserMessagesService);

  messages = this.userMessagesService.messages;

  dismiss(id: string) {
    this.userMessagesService.dismiss(id);
  }
}
