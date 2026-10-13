import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

import { AuthResponse } from './models/auth-response.model';
import { AUTH_TOKEN_STORAGE_KEY, USER_PROFILE_STORAGE_KEY } from './storage-keys';
import { UserMessagesService } from '../user-messages/user-messages.service';

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userMessagesService = inject(UserMessagesService);

  async signIn(email: string, password: string) {
    return await this.authenticate(() =>
      this.http.post<AuthResponse>('/api/sign-in', { email, password })
    );
  }

  async createUser(email: string, password: string) {
    return await this.authenticate(() =>
      this.http.post<AuthResponse>('/api/sign-up', { email, password })
    );
  }

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  async logout() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    await this.router.navigateByUrl('/sign-in');
  }

  private async authenticate(makeRequest: () => Observable<AuthResponse>) {
    try {
      const response = await firstValueFrom(makeRequest());

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(response.user));

      return true;
    } catch (error) {
      this.userMessagesService.showError(this.getErrorMessage(error));
      return false;
    }
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
      return error.error.message;
    }
    return GENERIC_ERROR_MESSAGE;
  }
}
