import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest, LoginResponse, UserInfo } from './auth.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/auth';

  private readonly isAuthenticated = signal<boolean>(this.hasValidToken());
  readonly currentUser = signal<UserInfo | null>(this.getUserFromStorage());

  constructor() { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      request
    )
    .pipe(
      tap(response => {
        localStorage.setItem('TOKEN_KEY', JSON.stringify(response.accessToken))
        localStorage.setItem('USER', JSON.stringify(response.user));
      }),
    );
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('TOKEN_KEY');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private getUserFromStorage(): UserInfo | null {
    const userData = localStorage.getItem('USER');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
}
