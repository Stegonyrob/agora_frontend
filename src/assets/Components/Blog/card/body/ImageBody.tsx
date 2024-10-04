import { IPost } from "../../../../../core/posts/IPost";
import style from './ImageBody.module.scss';
const DEFAULT_POST_PHOTO_URL = "../../../../../../../public/images/blocks-8866100_1280.png"

interface ImageBodyProps {
    post: IPost;
    source: string;
    alt: string;
}
const ImageBody = ({ post }: ImageBodyProps) => {
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
export default ImageBody