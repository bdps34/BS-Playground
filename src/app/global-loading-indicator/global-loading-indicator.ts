import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  isLoading = this.globalLoadingService.isLoading;

  constructor() {
    // Handle every router event as it arrives: the router emits several events synchronously,
    // so sampling only the latest one (e.g. through a signal) would miss NavigationStart.
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
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
