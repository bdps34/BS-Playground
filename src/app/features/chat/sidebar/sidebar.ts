import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { ChatHistorySummary } from '../models/chat-history-summary.model';
import { ChatHistory } from './chat-history/chat-history';

@Component({
  selector: 'sidebar',
  imports: [ChatHistory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  conversations = input.required<ChatHistorySummary[]>();
  selectedConversationId = input<string | null>(null);

  selectConversation = output<string>();
  newChat = output<void>();
  logout = output<void>();

  collapsed = signal(true);

  toggleCollapsed() {
    this.collapsed.update((value) => !value);
  }

  expand() {
    this.collapsed.set(false);
  }

  close() {
    this.collapsed.set(true);
  }
}
