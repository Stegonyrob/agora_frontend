
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { IEvent } from "../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../core/events/IEventDTO";
import { IPost } from "../../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../../core/posts/IPostDTO";
import styles from "../ButtonIcons.module.scss";
import EditEventForm from "./EditEventForm";
import EditPostForm from "./EditPostForm";
import EditTextForm from "./EditTextForm";
interface ButtonEditGenericProps {
    type: "post" | "event" | "text";
    item: IPost | IEvent | ITextItemDTO;
    onSubmit: (data: IPostDTO | IEventDTO | ITextItemDTO) => void;
}

const ButtonEditGeneric: React.FC<ButtonEditGenericProps> = ({ type, item, onSubmit }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleUpdate = async (updatedItem: IPostDTO | IEventDTO | ITextItemDTO) => {
        const sanitizeMap: Record<string, [string, string?]> = {
            post: ["title", "message"],
            event: ["title", "description"],
            text: ["text"]
        };

        const fields = sanitizeMap[type];
        if (fields) {
            fields.forEach(field => {
                if (field && field in updatedItem && typeof (updatedItem as any)[field] === "string") {
                    (updatedItem as any)[field] = DOMPurify.sanitize((updatedItem as any)[field]);
                }
            });
        }

        onSubmit(updatedItem);
    };
    return (
        <div>
            <div className={styles.editButtonBlock} onClick={handleShow}>
                <i className="bi bi-pencil-square" />
                <span className={styles.label}>Edición</span>
            </div>
            {type === "post" && show && (
                <EditPostForm
                    post={{
                        ...(item as IPost),
                        images: (item as any).images ?? [],
                        tags: Array.isArray((item as any).tags)
                            ? (item as any).tags.map((tag: any) =>
                                typeof tag === "string"
                                    ? { name: tag }
                                    : tag
                            )
                            : []
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
                        createdAt: (item as any).createdAt ?? new Date().toISOString(),
                        updatedAt: (item as any).updatedAt ?? new Date().toISOString(),
                        link: (item as any).link ?? "",
                        userId: (item as any).userId ?? 0,
                        tags: Array.isArray((item as any).tags)
                            ? (item as any).tags.map((tag: any) =>
                                typeof tag === "string"
                                    ? tag
                                    : tag?.name ?? ""
                            )
                            : [],
                        images: Array.isArray((item as any).images)
                            ? (item as any).images.filter((img: any) => typeof img === "object" && img !== null)
                            : []
                    }}
                    onSubmit={onSubmit}
                    onClose={handleClose}
                    show={show}
                />
            )}
            {type === "text" && show && (
                <EditTextForm
                    text={{
                        ...(item as ITextItemDTO),
                        createdAt: (item as any).createdAt ?? new Date().toISOString(),
                        updatedAt: (item as any).updatedAt ?? new Date().toISOString(),
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