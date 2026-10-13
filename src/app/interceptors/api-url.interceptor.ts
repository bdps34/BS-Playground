import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  return next(request.clone({ url: `${environment.apiUrl}${request.url}` }));
};
