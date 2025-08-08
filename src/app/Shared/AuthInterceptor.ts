import {
  HttpClient,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from './TokenService';
import { EncryptionService } from './encryption.service';
import { APIResponse } from '../Models/apiresponse';
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // Bypass token logic for login and refresh endpoints
  if (req.url.includes('/UserLogin') || req.url.includes('/refresh')) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const decryptionService = inject(EncryptionService);
  const http = inject(HttpClient);

  const encryptedToken = tokenService.getAccessToken();
  const accessToken = encryptedToken ? decryptionService.decrypt(encryptedToken) : null;

  // ✅ Set both Authorization and Cache-Control headers
  const headersConfig: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  if (accessToken) {
    headersConfig['Authorization'] = `Bearer ${accessToken}`;
  }

  const cloned = req.clone({ setHeaders: headersConfig });

  return next(cloned).pipe(
    catchError(err => {
      if (err.status === 401) {
        const refresh = tokenService.getRefreshToken();
        const refreshToken = refresh ? decryptionService.decrypt(refresh) : null;
        if (!refreshToken) return throwError(() => err);

        return http.post('/api/Authendicate/refresh', { refreshToken }).pipe(
          switchMap((res: any) => {
            tokenService.setTokens(res.Data.accessToken, res.Data.refreshToken);

            // Re-attach new token with no-cache headers
            const retried = req.clone({
              setHeaders: {
                'Authorization': `Bearer ${res.Data.accessToken}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });

            return next(retried);
          }),
          catchError(error => {
            tokenService.clearTokens();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => err);
    })
  );
};

