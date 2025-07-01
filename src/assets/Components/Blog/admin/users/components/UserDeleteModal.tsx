import IUser from '@/core/user/IUser';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface UserDeleteModalProps {
    show: boolean;
    user: IUser | null;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
    show,
    user,
    loading,
    onConfirm,
    onClose,
}) => {
    if (!user) return null;

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>🗑️ Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que quieres eliminar al usuario?</p>
                <div className="alert alert-warning">
                    <strong>Nombre:</strong> {user.fullName}<br />
                    <strong>Email:</strong> {user.email}<br />
                    <strong>Usuario:</strong> {user.username}
                </div>
                <p className="text-danger">
                    <strong>⚠️ Esta acción no se puede deshacer.</strong>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                    {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDeleteModal;
