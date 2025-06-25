export interface ISession {
  userId: number;
  role: string;
  userName: string;
  isLoggedIn: boolean;
  useremail: string;
  accessToken: string;
  refreshToken: string;
  expiresAt?: number; // Timestamp for session expiration
  isLoading?: boolean;
  viewAsUser?: boolean;
  avatarUrl?: string;
  userSettings?: {
    fontSize?: number;
    highContrast?: boolean;
    animations?: boolean;
    daltonic?: boolean;
    showPersonalInfo?: boolean;
    twoFA?: boolean;
    socialLinks?: string[];
  };
}
