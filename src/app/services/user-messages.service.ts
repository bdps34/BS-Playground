import { Injectable, signal } from '@angular/core';

import { UserMessage, UserMessageType } from '../models/user-message.model';

@Injectable({ providedIn: 'root' })
export class UserMessagesService {
  private messagesSignal = signal<UserMessage[]>([]);

  messages = this.messagesSignal.asReadonly();

  showError(text: string) {
    this.show('error', text);
  }

  showWarning(text: string) {
    this.show('warning', text);
  }

  showInfo(text: string) {
    this.show('info', text);
  }

  showSuccess(text: string) {
    this.show('success', text);
  }

  dismiss(id: string) {
    this.messagesSignal.update((messages) => messages.filter((message) => message.id !== id));
  }

  clearAll() {
    this.messagesSignal.set([]);
  }

  private show(type: UserMessageType, text: string) {
    const message: UserMessage = { id: crypto.randomUUID(), type, text };
    this.messagesSignal.update((messages) => [...messages, message]);
  }
}
