import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'loading-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    'aria-live': 'polite',
  },
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
  size = input(32);
  label = input('Loading...');
}
