import { ITokenDTO } from "../core/auth/ITokenDTO";
export interface LoginState {
  isLoggedIn: boolean;
  loginFormIsOpened: boolean;
  loggedUserId: number;
  loggedUserRole: string;
  JWTToken: ITokenDTO;
  accessToken: string;
  refreshToken: string;
  userId: number;
  role: string;
}
