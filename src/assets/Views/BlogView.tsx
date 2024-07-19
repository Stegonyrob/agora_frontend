import { useSelector } from 'react-redux';
import { Post } from 'types';
import { RootState } from '../../redux/store';
import CardPosts from '../Components/Blog/admin/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';

export default function BlogView() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = accessToken ? String(accessToken) : '';

  return (
    <div>
      <h2>Agora</h2>
      <PostList posts={[]} userId={userId} onSelect={function (post: Post): void {
        throw new Error('Function not implemented.');
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error('Function not implemented.');
      }} />
      <PostForm onSubmit={(post: Post) => {
        // Mocking the asynchronous operation
        return new Promise<void>((resolve) => {
          console.log("Submitting post:", post);
          resolve();
        });
      }} onClose={() => { }} />
      <CardPosts posts={[]} user={userId} onSelect={function (post: Post): void {
        throw new Error('Function not implemented.');
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error('Function not implemented.');
      }} />
    </div>
  );
}
