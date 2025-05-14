import ButtonFavoriteHeart from "@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart";
import AccordionComment from "@/assets/Components/Blog/comment/AccordionComment";
import { IPost } from "@/core/posts/IPost";
import React from "react";
import { Card } from "react-bootstrap";
import styles from "./CardFooterGeneral.module.scss";

interface CardFooterGeneralProps {
    userId: number;
    postId: number;
    onLove?: () => void;
    onSelect?: (item: any) => void; // Puede ser un post, evento, etc.
    showComments?: boolean;
    showFavoriteButton?: boolean;
    comments?: any[]; // Comentarios opcionales
    customButtons?: React.ReactNode; // Botones personalizados
}

const CardFooterGeneral: React.FC<CardFooterGeneralProps> = ({
    userId,
    postId,
    onLove,
    onSelect,
    showComments = false,
    showFavoriteButton = false,
    comments = [],
    customButtons,
}) => {
    const handleSelect = (post: IPost) => {
        if (onSelect) {
            onSelect(post);
        }
    };

    return (
        <Card className={styles.cardFooter}>
            <Card.Footer className={styles.cardFooter}>
                {showFavoriteButton && userId != null && postId != null && (
                    <ButtonFavoriteHeart
                        userId={userId}
                        postId={postId}
                        onSelect={handleSelect}
                        posts={[]}
                    />
                )}
                {showComments && comments != null && <AccordionComment comments={comments} />}
                {customButtons}
            </Card.Footer>
        </Card>
    );
};

export default CardFooterGeneral;