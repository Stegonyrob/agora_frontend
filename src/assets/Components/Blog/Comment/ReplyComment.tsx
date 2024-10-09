import styles from './ButtonComent.module.scss';
const InteractionAdminReply: React.FC<{ commentId: number }> = ({ commentId }) => {
    const handleReply = () => {
        // Aquí puedes agregar la lógica para responder al comentario
        console.log(`Responder al comentario ${commentId}`);
    };

    return (
        <span className={styles.icon}>
            <i className="bi bi-chat-right-dots" onClick={handleReply} />
        </span>
    );
};
export default InteractionAdminReply;