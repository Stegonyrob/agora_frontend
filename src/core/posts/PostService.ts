import type { title } from "process";
import type { IPost } from "./IPost";
import type PostRepository from "./PostRepository";


export default class PostService {

    repository: PostRepository;

    constructor(repository: PostRepository) {
        this.repository = repository
    }

    async get(): Promise<IPost[]> {
        const data: IPost[] = await this.repository.getAll()
        let list: IPost[] = []
        
        data.forEach((post: IPost) => {
            let template = { id: post.id, title: post.title }
            list.push(template)
        });

        return list
    }

}