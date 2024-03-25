import AuthRepository from "./AuthRepository";
import type { IAuthUser } from "./IAuthUser";
import type { ILoggedInUser } from "./ILoggedInUser";

export default class AuthService {

    repository: AuthRepository = new AuthRepository()

    async login(data: IAuthUser): Promise<ILoggedInUser> {

       
        const json = await this.repository.authenticateFetch(data)
        
        const user: ILoggedInUser = {
            email: json.email,
            roles: json.roles,
            isAuthenticated: true
        }

        return user
        
    }

}