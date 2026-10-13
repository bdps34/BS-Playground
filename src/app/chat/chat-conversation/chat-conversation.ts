import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';

import { Conversation } from '../../models/conversation.model';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import { ChatInput } from '../chat-input/chat-input';

@Component({
  selector: 'chat-conversation',
  imports: [ChatInput, LoadingIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-conversation.html',
  styleUrl: './chat-conversation.scss',
})
export class ChatConversation {
  conversation = input.required<Conversation>();
  isAwaitingReply = input(false);
  elapsedSeconds = input(0);

  submitMessage = output<string>();

  private messagesList = viewChild<ElementRef<HTMLElement>>('messagesList');
  private messageCount = computed(() => this.conversation().messages.length);

  constructor() {
    afterRenderEffect(() => {
      this.messageCount();
      const element = this.messagesList()?.nativeElement;
      element?.scrollTo({ top: element.scrollHeight });
    });
  }

  onSubmit(message: string) {
    this.submitMessage.emit(message);
  }
}
