import { IPost } from "../../../../../core/posts/IPost";
import Avatar from "./Avatar";
import Layout from "./Layout";
import UserInfo from "./UserInfo";

interface HeaderProps {
    post: IPost;
    onSelect: (post: IPost) => void;
}
const Header: React.FC<HeaderProps> = ({ post, onSelect }) => {
    return (
        <div onClick={() => onSelect(post)}>
            <Layout>
                <Avatar userId={0} alt_avatar={""} source_avatar={""} url_avatar={""} />
                <UserInfo username={""} time={""} location={""} userId={undefined} />

            </Layout>
        </div>
    );
};
export default Header