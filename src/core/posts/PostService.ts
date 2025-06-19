import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";
import PostRepository from "./PostRepository";

export default class PostService {
  repository: PostRepository;

  constructor(repository = new PostRepository()) {
    this.repository = repository;
  }

  // Lectura (user y admin)
  async getAllPosts(): Promise<IPost[]> {
    return await this.repository.getAll();
  }

  async getPostById(id: number): Promise<IPost> {
    return await this.repository.getById(id);
  }

  // CRUD (solo admin, el backend valida el rol)
  async createPost(post: IPostDTO): Promise<IPost> {
    return await this.repository.create(post);
  }

  async updatePost(postId: number, post: IPostDTO): Promise<IPost> {
    return await this.repository.update(postId, post);
  }

  async deletePost(p0: IPostDTO, postId: number): Promise<void> {
    return await this.repository.delete(postId);
  }

  async archivePost(postId: number, archive: boolean): Promise<void> {
    return await this.repository.archive(postId, archive);
  }
  async unArchivePost(postId: number): Promise<void> {
    return await this.repository.archive(postId, false);
  }
}
