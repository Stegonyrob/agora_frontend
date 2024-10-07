
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import { IPost } from "../../../../core/posts/IPost"
import PostsService from "../../../../core/posts/PostService"
import { RootState } from "../../../../redux/store"
import styles from "./Card.module.scss"
import Layout from "./LayoutCard"
import Body from "./body/Body"
import FooterAdmin from "./footer/admin/FooterAdmin"
import Header from "./header/Header"
interface CardProps {
    user: number;
    onSelect: (post: IPost) => void;
    onDelete: (postId: string) => Promise<void>;
    posts: IPost[];
}

const Card: React.FC<CardProps> = ({ user, onSelect, onDelete }) => {
    const accessToken = useSelector((state: RootState) => state.login.accessToken);
    const role = useSelector((state: RootState) => state.user.userRole);
    const isAuthenticated = useSelector((state: RootState) => state.login.isLoggedIn);
    const apiPost = new PostsService();
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [commentCounter, setCommentCounter] = useState(0);

    const [loveCounter, setLoveCounter] = useState(0);



    const commentHandler = () => {
        setCommentCounter((prevState) => prevState + 1);
    };

    const loveHandler = () => {
        setLoveCounter((prevState) => prevState + 1);
    };

    useEffect(() => {
        console.log("isAuthenticated: ", isAuthenticated);
        if (isAuthenticated) {
            console.log("loadPosts");
            loadPosts();
        }
    }, [isAuthenticated,]);

    const loadPosts = async () => {
        try {
            const fetchedPosts = await apiPost.fetchPosts();
            console.log("fetchedPosts: ", fetchedPosts);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Error loading posts: ", error);
            alert("Post not found, sorry for the inconvenience");
        }
    };

    return (
        <div className={styles.card}>
            <Layout>
                <Container>
                    <Row>
                        {posts.map((post) => (
                            <Col key={post.id}>
                                <Header post={post} onSelect={onSelect} />
                                <Body posts={post} />
                                <FooterAdmin
                                    post={post}

                                    commentCounter={(value: number) => setCommentCounter(value)}

                                    loveCounter={loveCounter}
                                    onComment={setCommentCounter}

                                    onLove={setLoveCounter} loveIcon={""} loveCount={0} isLoved={false} color={""} love={function (): void {
                                        throw new Error("Function not implemented.")
                                    }} archive={function (): void {
                                        throw new Error("Function not implemented.")
                                    }} edit={function (): void {
                                        throw new Error("Function not implemented.")
                                    }} reply={function (): void {
                                        throw new Error("Function not implemented.")
                                    }} unArchive={function (): void {
                                        throw new Error("Function not implemented.")
                                    }} setLoveIcon={function (value: string): void {
                                        throw new Error("Function not implemented.")
                                    }} setLoveCount={function (value: number): void {
                                        throw new Error("Function not implemented.")
                                    }} setColor={function (value: string): void {
                                        throw new Error("Function not implemented.")
                                    }} setLoved={function (value: boolean): void {
                                        throw new Error("Function not implemented.")
                                    }} setArchive={function (value: boolean): void {
                                        throw new Error("Function not implemented.")
                                    }} setEdit={function (value: boolean): void {
                                        throw new Error("Function not implemented.")
                                    }} setReply={function (value: boolean): void {
                                        throw new Error("Function not implemented.")
                                    }} setUnArchive={function (value: boolean): void {
                                        throw new Error("Function not implemented.")
                                    }} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Layout>
        </div>
    );
};

export default Card;