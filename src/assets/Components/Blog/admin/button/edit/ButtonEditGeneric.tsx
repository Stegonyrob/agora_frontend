
import { IText } from "@/core/texts/IText";
import { ITextDTO } from "@/core/texts/ITextDTO";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { IEvent } from "../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../core/events/IEventDTO";
import { IPost } from "../../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../../core/posts/IPostDTO";
import styles from "../ButtonIcons.module.scss";
import EventForm from "../create-edit/EventForm";
import PostForm from "../create-edit/PostForm";
import TextForm from "../create-edit/TextForm";
interface ButtonEditGenericProps {
    type: "post" | "event" | "text";
    item: IPost | IEvent | IText;
    onSubmit: (data: IPostDTO | IEventDTO | ITextDTO) => void;
}

const ButtonEditGeneric: React.FC<ButtonEditGenericProps> = ({ type, item, onSubmit }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // Funciones onSubmit específicas para cada tipo
    const handlePostSubmit = async (post: IPost) => {
        // Sanitiza campos si es necesario
        if (post.title) post.title = DOMPurify.sanitize(post.title);
        if (post.message) post.message = DOMPurify.sanitize(post.message);
        await onSubmit(post as any);
    };

    const handleEventSubmit = async (event: IEvent) => {
        if (event.title) event.title = DOMPurify.sanitize(event.title);
        if ((event as any).description) (event as any).description = DOMPurify.sanitize((event as any).description);
        await onSubmit(event as any);
    };

    const handleTextSubmit = async (text: any) => {
        if (text.text) text.text = DOMPurify.sanitize(text.text);
        if (text.description) text.description = DOMPurify.sanitize(text.description);
        await onSubmit(text as any);
    };
    return (
        <div>
            <div className={styles.editButtonBlock} onClick={handleShow}>
                <i className="bi bi-pencil-square" />
                <span className={styles.label}>Edición</span>
            </div>
            {type === "post" && show && (
                <PostForm
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
                    onSubmit={handlePostSubmit}
                    mode="edit"
                    onClose={handleClose}
                    show={show}
                />
            )}
            {type === "event" && show && (
                <EventForm
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
                    onSubmit={handleEventSubmit}
                    onClose={handleClose}
                    show={show}
                    mode="edit"
                />
            )}
            {type === "text" && show && (
                <TextForm
                    text={{
                        // Solo las propiedades válidas de IText
                        id: typeof (item as any).id === "number" ? (item as any).id : 0,
                        title: (item as any).title ?? "",
                        createdAt: (item as any).createdAt ?? new Date().toISOString(),
                        updatedAt: (item as any).updatedAt ?? new Date().toISOString(),
                        name_image: (item as any).name_image ?? "",
                        images: (item as any).images ?? [],
                        message: (item as any).message ?? "",
                        category: (item as any).category ?? ""
                    }}
                    onSubmit={handleTextSubmit}
                    onClose={handleClose}
                    show={show} mode={"edit"} />
            )}
        </div>
    );
};

export default ButtonEditGeneric;