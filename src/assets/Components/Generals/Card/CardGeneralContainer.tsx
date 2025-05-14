import { ISession } from "@/core/auth/ISession";
import { IEvent } from "@/core/events/IEvent";
import { IPost } from "@/core/posts/IPost";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CardGeneral from "./CardGeneral";



interface CardGeneralContainerProps {
    type: "post" | "event";
    session: ISession[];
    userId: number;
    id: number;
    items: Array<{
        id: number;
        title: string;
        message: string;
        description: string;
        image: string;
        customContent?: React.ReactNode;
        customButtons?: React.ReactNode;
    }>;
    onSelect: (item: any) => void;
    isLoggedIn?: boolean;

}

const CardGeneralContainer: React.FC<CardGeneralContainerProps> = ({
    type,
    items,
    onSelect,
    id,

}) => {


    const [itemsState, setItemsState] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [postsState, setPostsState] = useState<IPost[]>([]);
    const [eventsState, setEventsState] = useState<IEvent[]>([]);
    const [commentCounter, setCommentCounter] = useState(0);
    const [tweetCounter, setTweetCounter] = useState(0);
    const [loveCounter, setLoveCounter] = useState(0);
    const userId = sessionStorage.userId;
    const userName = sessionStorage.userName;
    const userRole = sessionStorage.role;
    const isLoggedIn = sessionStorage.isLoggedIn;



    useEffect(() => {
        console.log("CardGeneralContainer: useEffect: items", items);
        setItemsState(items || []);
    }, [items]);

    return (
        <Container>
            <Row>
                {itemsState.map((item) => {
                    console.log("CardGeneralContainer: itemsState.map: item", item);
                    return (
                        <Col key={item.id}>
                            <CardGeneral
                                type={type}
                                isLoggedIn={isLoggedIn}
                                headerProps={{
                                    title: item.title,
                                    subtitle: item.description,
                                    imageUrl: item.image,
                                    customContent: item.customContent,
                                }}
                                bodyProps={{
                                    type: type,
                                    title: item.title,
                                    message: item.message,
                                    description: item.description,
                                    image: item.image,
                                    customContent: item.customContent,
                                }}
                                footerProps={{
                                    userId: 1,
                                    postId: item.id,
                                    onSelect: () => onSelect(item),
                                    showComments: false,
                                    showFavoriteButton: false,
                                    comments: [],
                                    customButtons: item.customButtons,

                                }}

                                onSelect={() => {
                                    console.log("CardGeneralContainer: onSelect: item", item);
                                    onSelect(item);
                                }} // Llama a la función onSelect al hacer clic en el card
                                onLove={() => console.log("Loved!")} // Cambia esto según tu lógica
                                showComments={false} // Cambia esto según tu lógica
                                showFavoriteButton={false} // Cambia esto según tu lógica
                                comments={[]} // Cambia esto según tu lógica
                                customButtons={item.customButtons} // Cambia esto según tu lógica

                            />

                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default CardGeneralContainer;