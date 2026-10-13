import { HttpInterceptorFn } from '@angular/common/http';

import { AUTH_TOKEN_STORAGE_KEY } from '../services/storage-keys';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!token) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
