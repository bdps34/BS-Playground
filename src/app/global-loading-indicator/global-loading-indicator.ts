import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { GlobalLoadingService } from '../services/global-loading.service';

@Component({
  selector: 'global-loading-indicator',
  imports: [LoadingIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-loading-indicator.html',
  styleUrl: './global-loading-indicator.scss',
})
export class GlobalLoadingIndicator {
  private router = inject(Router);
  private globalLoadingService = inject(GlobalLoadingService);

  private latestNavigationEvent = toSignal(this.router.events, { initialValue: null });

  isLoading = this.globalLoadingService.isLoading;

  constructor() {
    effect(() => {
      const event = this.latestNavigationEvent();
      console.log('TEMP-TRACE nav event:', event?.constructor?.name, event);

      if (event instanceof NavigationStart) {
        this.globalLoadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.globalLoadingService.hide();
      }
    });
  }
}
