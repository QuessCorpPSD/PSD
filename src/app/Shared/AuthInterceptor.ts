import { HttpClient, HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from './TokenService';
import { EncryptionService } from './encryption.service';
import { APIResponse } from '../Models/apiresponse';
import { SessionStorageService } from './SessionStorageService';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // Bypass token logic for login and refresh endpoints
  if (req.url.includes('/UserLogin') || req.url.includes('/Authendicate/refresh')) {    
    return next(req);
  }

  const tokenService = inject(TokenService);
  const decryptionService = inject(EncryptionService);
  const http = inject(HttpClient);
  const sessionStorage = inject(SessionStorageService);
   const router = inject(Router);
const apiurl=environment;
  const encryptedUser = sessionStorage.getItem('UserProfile');
  //const user = encryptedUser ? decryptionService.decrypt(encryptedUser) : null;  

  const encryptedToken = tokenService.getAccessToken();
  const accessToken = encryptedToken ? decryptionService.decrypt(encryptedToken) : null;  
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
        const refreshToken = refresh ? decryptionService.decrypt(refresh) : '';   
         if (!refreshToken) {        
          tokenService.clearTokens();
          router.navigate(['/unauthendicate']);
          return throwError(() => err);
        }    
        
       let users = JSON.parse(decryptionService.decrypt(encryptedUser?encryptedUser:''));
       if (!users?.user_Id) {      
    tokenService.clearTokens();
   // router.navigate(['/unauthendicate']);
    return throwError(() =>console.log( err));
  }
        const request={  
          "User_Id":users?.user_Id,        
          "AccessToken":"",
          "RefreshToken":""
        }
        // if (!refreshToken) return throwError(() => err);
        // alert('refresh token eeoe');
        //   const headers = new HttpHeaders({
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/json'
        // });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return http.post<any>(`${apiurl.apiUrl}Authendicate/refresh`,JSON.stringify(request), { headers:config }).pipe(
          switchMap((res: any) => {
            const refreshUrl = `${apiurl.apiUrl}/api/Authendicate/refresh`;
          
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
            return throwError(() =>
               console.error(' Refresh API Failed:', error)
              );
          })
        );
      }
      return throwError(() => err);
    })
  );
};

