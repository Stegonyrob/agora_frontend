import { IEvent } from "../../../core/events/IEvent";
import style from "./ImageEvent.module.scss";

const DEFAULT_EVENT_PHOTO_URL = "../../../../../../../public/images/default-event-image.png";

interface ImageEventProps {
    event: IEvent;
    source: string;
    alt: string;
}

const ImageEvent = ({ event }: ImageEventProps) => {
    const source = event.image || DEFAULT_EVENT_PHOTO_URL;
    const alt = event.title || "Imagen del evento";

    return (
        <div className={style.imageContainer}>
            <img src={String(source)} alt={String(alt)} className={style.imageEvent} />
        </div>
    );
};

export default ImageEvent;