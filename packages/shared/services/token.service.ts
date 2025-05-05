import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  finalize,
  map,
  Observable,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessToken = signal<string | null>(
    localStorage.getItem('access_token')
  );
  private refreshToken = signal<string | null>(
    localStorage.getItem('refresh_token')
  );

  private refreshingInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private _http: HttpClient) {}

  getAccessToken() {
    return this.accessToken();
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    this.accessToken.set(access);
    this.refreshToken.set(refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshingInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1)
      );
    }

    this.refreshingInProgress = true;
    this.refreshTokenSubject.next(null);

    return this._http
      .post<{ access_token: string }>('/auth/refresh', {
        refresh_token: this.refreshToken(),
      })
      .pipe(
        tap(response => {
          this.setTokens(response.access_token, this.refreshToken()!);
          this.refreshTokenSubject.next(response.access_token);
        }),
        finalize(() => {
          this.refreshingInProgress = false;
        }),
        map(response => response.access_token)
      );
  }
}
