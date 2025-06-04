import React from "react";
import { IEvent } from "../../../../../../core/events/IEvent";
import style from './ImageEvent.module.scss';
const DEFAULT_EVENT_PHOTO_URL = "/images/blocks-8866100_1280.png";

interface ImageEventProps {
    event: IEvent;
}

const ImageEvent: React.FC<ImageEventProps> = ({ event }) => {
    const source = event.images && event.images.length > 0 ? event.images[0] : DEFAULT_EVENT_PHOTO_URL;
    const alt = event.title || "Imagen del evento";

    return (
        <div className={style.imageEventContainer}>
            <img
                src={source}
                alt={alt}
                className={style.imageEvent}
            />
        </div>
    );
};

export default ImageEvent;