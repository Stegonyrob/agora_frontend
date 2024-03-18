import type { IUser } from "./IUser";
import UserRepository from "./UserRepository";

export default class UserService {

    repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository
    }

    async get(): Promise<IUser[]> {
        const data: IUser[] = await this.repository.getAll()
        let list: IUser[] = []
        
        data.forEach((user: IUser) => {
            let template = { id: user.id, name: user.name }
            list.push(template)
        });

        return list
    }

}