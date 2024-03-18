
import type { IAuthUser } from "./IAuthUser";
import type { ILoggedInUser } from "./ILoggedInUser";

export default class AuthRepository {
    uri: string = import.meta.env.VITE_APP_API_SPRING; // Asegúrate de que esta variable esté correctamente configurada

    async authenticateFetch(data: IAuthUser): Promise<ILoggedInUser> {
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Basic ' + btoa(data.username + ':' + data.password));

            const options: RequestInit = {
                method: 'GET',
                headers: myHeaders,
                credentials: 'include',
            };
            const response = await fetch(this.uri + '/login', options);
            if (!response.ok) {
                throw new Error('API does not respond');
            }
            const json = await response.json();
            return json;
        } catch (error) {
            throw new Error('API does not respond: ' + error);
        }
    }
}