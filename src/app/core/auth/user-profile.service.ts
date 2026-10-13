import { Injectable, signal } from '@angular/core';

import { UserProfile } from './models/user-profile.model';
import { USER_PROFILE_STORAGE_KEY } from './storage-keys';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private profileSignal = signal<UserProfile | null>(this.readFromStorage());

  profile = this.profileSignal.asReadonly();

  reload() {
    this.profileSignal.set(this.readFromStorage());
  }

  clear() {
    this.profileSignal.set(null);
  }

  private readFromStorage(): UserProfile | null {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }
}
