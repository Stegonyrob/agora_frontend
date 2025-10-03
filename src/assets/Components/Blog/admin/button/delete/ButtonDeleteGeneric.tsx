
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "../ButtonIcons.module.scss";

interface ButtonDeleteGenericProps {
    type: "post" | "event" | "text";
    id: number;
    title: string;
    onDelete: (id: number) => Promise<void>;
}

const ButtonDeleteGeneric: React.FC<ButtonDeleteGenericProps> = ({ type, id, title, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleShow = () => setShowConfirm(true);
    const handleClose = () => setShowConfirm(false);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(id);
            setShowConfirm(false);
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Error al eliminar el ${type}. Inténtelo de nuevo.`);
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'post': return 'post';
            case 'event': return 'evento';
            case 'text': return 'texto';
            default: return 'elemento';
        }
    };

    return (
        <>
            <div className={styles.deleteButtonBlock} onClick={handleShow}>
                <i className="bi bi-trash" />
                <span className={styles.label}>Eliminar</span>
            </div>

            <Modal show={showConfirm} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que quieres eliminar este {getTypeLabel()}?</p>
                    <p><strong>"{title}"</strong></p>
                    <p>Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ButtonDeleteGeneric;