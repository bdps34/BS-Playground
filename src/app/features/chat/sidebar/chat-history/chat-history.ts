import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ChatHistorySummary } from '../../models/chat-history-summary.model';

@Component({
  selector: 'chat-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {
  conversations = input.required<ChatHistorySummary[]>();
  selectedId = input<string | null>(null);

  conversationSelected = output<string>();
}
