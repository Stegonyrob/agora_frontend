import PostService from "../../core/posts/PostService";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

// Define el store de posts en Redux
export const postsStore = {
  state: () => ({
    posts: [] as IPost[], // Arreglo de posts
    isLoaded: false as boolean, // Indicador de si los posts han sido cargados
  }),

  actions: {
    // Acción para obtener todos los posts
    async getAllPosts(this: any): Promise<IPost[]> {
      const postService = new PostService();
      const posts = await postService.fetchPosts();
      this.posts = posts;
      this.isLoaded = true;
      return this.posts;
    },

    async savePost(this: any, post: IPostDTO): Promise<void> {
      const postService = new PostService();
      const newPost = await postService.createPost(post);
      this.posts.push(newPost);
      this.isLoaded = true;
    },

    // Action to update an existing post
    async updatePost(
      this: any,
      updatedPostData: IPostDTO,
      postId: number
    ): Promise<void> {
      const postService = new PostService();
      const updatedPost = await postService.updatePost(updatedPostData, postId);
      const index = this.posts.findIndex(
        (post: { id: number }) => post.id === postId
      );
      this.posts[index] = updatedPost;
    },

    // Action to delete a post
    async deletePost(this: any, postId: number): Promise<void> {
      const postService = new PostService();
      await postService.deletePost(postId);
      const index = this.posts.findIndex(
        (post: { id: number }) => post.id === postId
      );
      this.posts.splice(index, 1);
    },
  },
};
