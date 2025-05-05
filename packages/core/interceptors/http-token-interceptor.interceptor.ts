import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { TokenService } from '../../shared/services/token.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private _tokenService: TokenService) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this._tokenService.getAccessToken();

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this._tokenService.refreshAccessToken().pipe(
            switchMap(newToken => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              this._tokenService.clearTokens();
              return throwError(() => error);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
