
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { IEvent } from "../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../core/events/IEventDTO";
import { IPost } from "../../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../../core/posts/IPostDTO";
import styles from '../ButtonIcons.module.scss';
import EditEventForm from "./EditEventForm";
import EditPostForm from "./EditPostForm";
interface ButtonEditGenericProps {
    type: "post" | "event";
    item: IPost | IEvent;
    onSubmit: (data: IPostDTO | IEventDTO) => void;
}

const ButtonEditGeneric: React.FC<ButtonEditGenericProps> = ({ type, item, onSubmit }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleUpdate = async (updatedItem: IPostDTO | IEventDTO) => {
        // Sanitize inputs
        if (type === "post") {
            updatedItem.title = DOMPurify.sanitize(updatedItem.title);
            updatedItem.message = DOMPurify.sanitize(updatedItem.message);
        } else if (type === "event") {
            updatedItem.title = DOMPurify.sanitize(updatedItem.title);
            updatedItem.description = DOMPurify.sanitize(updatedItem.description);
        }

        onSubmit(updatedItem);
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons} onClick={handleShow}>
                <i
                    className="bi bi-pencil-square"
                    onClick={handleShow}
                />
            </span>
            {type === "post" && show && (
                <EditPostForm
                    post={{
                        ...(item as IPost),
                        images: (item as any).images ?? []
                    }}
                    onSubmit={onSubmit}
                    onClose={handleClose}
                    show={show}
                />
            )}
            {type === "event" && show && (
                <EditEventForm
                    event={{
                        ...(item as IEvent),
                        alt_avatar: (item as any).alt_avatar ?? "",
                        source_avatar: (item as any).source_avatar ?? "",
                        description: (item as any).description ?? "",
                        createdAt: (item as any).createdAt ?? new Date().toISOString(),
                        updatedAt: (item as any).updatedAt ?? new Date().toISOString(),
                        date: (item as any).date ?? new Date().toISOString(),
                        link: (item as any).link ?? "",
                        userId: (item as any).userId ?? 0,
                    }}
                    onSubmit={onSubmit}
                    onClose={handleClose}
                    show={show}
                />
            )}
        </div>
    );
};

export default ButtonEditGeneric;