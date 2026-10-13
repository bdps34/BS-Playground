import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { ChatInput } from '../chat-input/chat-input';

@Component({
  selector: 'chat-initial-state',
  imports: [NgOptimizedImage, ChatInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-initial-state.html',
  styleUrl: './chat-initial-state.scss',
})
export class ChatInitialState {
  submitMessage = output<string>();

  onSubmit(message: string) {
    this.submitMessage.emit(message);
  }
}
