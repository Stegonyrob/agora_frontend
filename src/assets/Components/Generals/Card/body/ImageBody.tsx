import { IEvent } from "../../../../../core/events/IEvent";
import { IPost } from "../../../../../core/posts/IPost";
import style from './ImageBody.module.scss';

const DEFAULT_POST_PHOTO_URL = "../../../../../../../public/images/blocks-8866100_1280.png";

interface ImageBodyProps {
    type: "post" | "event"; // Tipo de contenido
    source: string; // URL de la imagen
    alt: string; // Texto alternativo
    post?: IPost; // Opcional para post
    event?: IEvent; // Opcional para event
}

const ImageBody: React.FC<ImageBodyProps> = ({ type, source, alt, post, event }) => {
    const imageStyle = style

    // Usa la URL de la imagen o un valor predeterminado
    const imageSource = source || DEFAULT_POST_PHOTO_URL;

    return (
        <div className={style.imageContainer}>
            <img
                src={imageSource}
                alt={alt}
                style={imageStyle} // Aplica el estilo dinámico
                className={style.imagePost}
            />
        </div>
    );
};

export default ImageBody;