import { IPost } from "../../../../../core/posts/IPost";
import style from './ImagePost.module.scss';
const DEFAULT_POST_PHOTO_URL = "../../../../../../../public/images/blocks-8866100_1280.png"

interface ImagePostProps {
    post: IPost;
    source: string;
    alt: string;
}
const ImagePost = ({ post }: ImagePostProps) => {
    const source = post.source_image || DEFAULT_POST_PHOTO_URL;
    const alt = post.alt_image || DEFAULT_POST_PHOTO_URL;

    return (
        <div style={style}>
            <img
                src={source}
                alt={alt}
                className={style.imagePost} />
        </div>
    );
};
export default ImagePost;