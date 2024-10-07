import React from "react";
import styles from './FooterAdmin.module.scss';
const InteractionAdminComment: React.FC = () => {
    return (
        <span className={styles.icon}>
            <i className="bi bi-chat-text"></i>
        </span>
    );
};

const InteractionAdminReply: React.FC = () => {
    return (
        <span className={styles.icon}>
            <i className="bi bi-chat-right-dots"></i>
        </span>
    );
};

const InteractionAdminUnarchive: React.FC = () => {
    return (
        <span className={styles.icon}>
            <i className="bi bi-file-earmark-arrow-down"></i>
        </span>
    );
};

const InteractionAdminArchive: React.FC = () => {
    return (
        <span className={styles.icon}>
            <i className="bi bi-file-earmark-arrow-up"></i>
        </span>
    );
};

const InteractionAdminEdit: React.FC = () => {
    return (
        <span className={styles.icon}>
            <i className="bi bi-pencil-square"></i>
        </span>
    );
};

export {
    InteractionAdminArchive, InteractionAdminComment, InteractionAdminEdit, InteractionAdminReply,
    InteractionAdminUnarchive
};
