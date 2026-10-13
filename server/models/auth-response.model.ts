import { UserProfile } from './user-profile.model';

export type AuthResponse = {
  token: string;
  user: UserProfile;
};
