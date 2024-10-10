import { useSelector } from 'react-redux';
import { IPost } from '../../core/posts/IPost';
import { RootState } from '../../redux/store';
import CardPosts from '../Components/Blog/admin/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';

export default function BlogView() {
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const userId = accessToken ? parseInt(accessToken, 10) : 0;

  return (
    <div>
      <h2>Agora</h2>
      <PostList posts={[]} onSelect={function (post: IPost): void {
        throw new Error('Function not implemented.');
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error('Function not implemented.');
      }} onClose={function (): void {
        throw new Error('Function not implemented.');
      }} onEdit={function (post: IPost): void {
        throw new Error('Function not implemented.');
      }} onCreate={function (post: IPost): void {
        throw new Error('Function not implemented.');
      }} userId={0} username={''} role={''} />
      <PostForm onClose={function (): void {
        throw new Error('Function not implemented.');
      }} onSubmit={function (post: IPost): Promise<void> {
        throw new Error('Function not implemented.');
      }} show={false} />
      <CardPosts user={0} onSelect={function (post: IPost): void {
        throw new Error('Function not implemented.');
      }} onDelete={function (postId: string): Promise<void> {
        throw new Error('Function not implemented.');
      }} posts={[]} role={''} userName={''} />
    </div>
  );
}
