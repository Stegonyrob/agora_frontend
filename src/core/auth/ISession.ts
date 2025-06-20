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
  viewAsUser?: boolean; // Optional flag to indicate if the user is being viewed as another user
}
