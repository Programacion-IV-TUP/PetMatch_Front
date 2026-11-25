import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const transloco = inject(TranslocoService);

  // Only attach auth/language headers to requests targeting our API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = tokenStorage.getToken();
  const activeLang = transloco.getActiveLang() || 'es';

  let headers = req.headers.set('Accept-Language', activeLang);

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const clonedReq = req.clone({ headers });
  return next(clonedReq);
};