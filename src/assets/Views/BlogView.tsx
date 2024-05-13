import { Post } from "types";
import PostList from "../Components/Blog/PostList";

export default function AgoraView() {
   return (
     <div>
       <h2>Agora</h2>
       <PostList posts={[]} onSelect={function (post: Post): void {
         throw new Error("Function not implemented.");
       } } onDelete={function (postId: string): Promise<void> {
         throw new Error("Function not implemented.");
       } }/>
    
     </div>
   );
 }
 