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
            let template = {
                id: post.id,
                title: post.title,
                user_id: post.user_id,
                postname: post.postname,
                creation_date: post.creation_date,
                message: post.message
            }
            list.push(template)
        });

        return list
    }

}
