import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'chat-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.scss',
})
export class ChatInput {
  placeholder = input('Ask anything...');
  disabled = input(false);

  submitMessage = output<string>();

  value = signal('');

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.submit();
  }

  submit() {
    if (this.disabled()) {
      return;
    }
    const trimmed = this.value().trim();
    if (!trimmed) {
      return;
    }
    this.submitMessage.emit(trimmed);
    this.value.set('');
  }
}
