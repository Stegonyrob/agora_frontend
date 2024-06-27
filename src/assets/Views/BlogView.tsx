
import { useSelector } from 'react-redux';
import { Post } from 'types';
import CardPosts from '../Components/Blog/CardPosts';
import { CardPostUser } from '../Components/Blog/CardPostUser/CardPostUser';
import PostForm from '../Components/Blog/PostForm';
import PostList from '../Components/Blog/PostList';
import ProfileForm from '../Components/Profile/ProfileForm';
import { RootState } from '../redux/store';


export default function BlogView() {
  const { userRole, userId } = useSelector((state: RootState) => state.user);

  if (userRole === "admin") {
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
  } else {
    return (
      <div>
        <ProfileForm />
        <CardPostUser children={<CardPostUser children={undefined} postId={''} />} postId="a-valid-post-id" />
      </div>
    );
  }
}
