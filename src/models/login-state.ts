import { ITokenDTO } from "../core/auth/ITokenDTO";
export interface LoginState {
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string;
  loggedUserName: string;
  JWTToken: ITokenDTO;
  accessToken: string;
  refreshToken: string;
  userId: number;
  role: string;
  username: string;
}
