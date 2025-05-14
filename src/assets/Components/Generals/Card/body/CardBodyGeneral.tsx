import ImageBody from "@/assets/Components/Generals/Card/body/ImageBody";
import { IEvent } from "@/core/events/IEvent";
import { IPost } from "@/core/posts/IPost";
import PropTypes from "prop-types";
import React from "react";
import { Card } from "react-bootstrap";
import styles from "./CardBodyGeneral.module.scss";
interface CardBodyGeneralProps {
    type: "post" | "event";
    title: string;
    message?: string;
    description?: string;
    image?: string;
    alt?: string; // Add this line
    customContent?: React.ReactNode;
    post: IPost;
    event?: IEvent;
    onSelect?: (item: any) => void;

}

const CardBodyGeneral: React.FC<CardBodyGeneralProps> = ({ type, title, message, description, image, customContent }) => {
    return (
        <Card>
            <Card.Body className={styles.cardBody}>
                <ImageBody source={image || ''} alt={''} type={"post"} />
                <Card.Text className={styles.cardText}>{type === "post" ? message : description}</Card.Text>
                {customContent && <div>{customContent}</div>}
            </Card.Body>
        </Card>
    );
};

CardBodyGeneral.propTypes = {
    type: PropTypes.oneOf<"post" | "event">(["post", "event"]).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    customContent: PropTypes.node,
};

export default CardBodyGeneral;