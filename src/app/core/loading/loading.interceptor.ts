import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { GlobalLoadingService } from './global-loading.service';
import { SKIP_GLOBAL_LOADING } from './skip-global-loading.token';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.context.get(SKIP_GLOBAL_LOADING)) {
    return next(request);
  }

  const globalLoadingService = inject(GlobalLoadingService);
  globalLoadingService.show();

  return next(request).pipe(finalize(() => globalLoadingService.hide()));
};
