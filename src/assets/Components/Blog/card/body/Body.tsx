import { IPost } from "../../../../../core/posts/IPost";
import ImageBody from "./ImageBody";
import LayoutBody from "./LayoutBody";
import TextBody from "./TextBody";

interface BodyProps {
    posts: IPost;

}
const Body: React.FC<BodyProps> = ({ posts }) => {
    return (
        <LayoutBody>
            <ImageBody post={posts} source={""} alt={""} />
            <TextBody title={posts.title} message={posts.message as string} tags={""} />

        </LayoutBody>
    );
};

export default Body;