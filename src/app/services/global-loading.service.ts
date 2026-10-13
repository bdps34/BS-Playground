import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {
  private activeCount = 0;
  private loadingSignal = signal(false);

  isLoading = this.loadingSignal.asReadonly();

  show() {
    this.activeCount++;
    this.loadingSignal.set(true);
  }

  hide() {
    this.activeCount = Math.max(0, this.activeCount - 1);

    if (this.activeCount === 0) {
      this.loadingSignal.set(false);
    }
  }
}
