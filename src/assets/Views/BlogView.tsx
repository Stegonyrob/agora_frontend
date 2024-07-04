
import { useSelector } from 'react-redux';
import { Post } from 'types';
import { RootState } from '../../redux/store';
import CardPosts from '../Components/Blog/admin/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';


export default function BlogView() {
  const { userRole, userId } = useSelector((state: RootState) => state.user);


  return (
    <div>
      <h2>Agora</h2>
      <PostList posts={[]} onSelect={function (post: Post): void {
        throw new Error("Function not implemented.");
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error("Function not implemented.");
      }} userId={userId} />

      <PostForm
        onSubmit={(post: Post) => Promise.resolve()}
        onClose={() => { }}
      />
      <CardPosts posts={[]} onSelect={function (post: Post): void {
        throw new Error("Function not implemented.");
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error("Function not implemented.");
      }} user={''} />
    </div>
  );

}