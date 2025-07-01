import IUser from '@/core/user/IUser';
import React from 'react';
import { Badge, Button, Col, Modal, Row } from 'react-bootstrap';

interface UserViewModalProps {
    show: boolean;
    user: IUser | null;
    onClose: () => void;
}

const UserViewModal: React.FC<UserViewModalProps> = ({ show, user, onClose }) => {
    if (!user) return null;

    const getRoleBadge = (roles: string[]) => {
        const isAdmin = roles.includes('ROLE_ADMIN');
        const variant = isAdmin ? 'danger' : 'primary';
        const text = isAdmin ? 'Admin' : 'Usuario';
        return <Badge bg={variant}>{text}</Badge>;
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>👁️ Detalles del Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={4} className="text-center">
                        <img
                            src={user.avatarUrl || '/images/avatarGeneric.png'}
                            alt={user.fullName}
                            className="img-fluid rounded-circle mb-3"
                            style={{ maxWidth: '150px' }}
                        />
                    </Col>
                    <Col md={8}>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td><strong>ID:</strong></td>
                                    <td>{user.id}</td>
                                </tr>
                                <tr>
                                    <td><strong>Nombre:</strong></td>
                                    <td>{user.fullName}</td>
                                </tr>
                                <tr>
                                    <td><strong>Usuario:</strong></td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <td><strong>Email:</strong></td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <td><strong>Rol:</strong></td>
                                    <td>{getRoleBadge(user.roles)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Avatar ID:</strong></td>
                                    <td>{user.avatarId || 'Sin avatar'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Estado:</strong></td>
                                    <td>
                                        {user.banned ? (
                                            <Badge bg="danger">Baneado</Badge>
                                        ) : (
                                            <Badge bg="success">Activo</Badge>
                                        )}
                                    </td>
                                </tr>
                                {user.banReason && (
                                    <tr>
                                        <td><strong>Razón del baneo:</strong></td>
                                        <td>{user.banReason}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td><strong>Reglas aceptadas:</strong></td>
                                    <td>
                                        {user.acceptedRules ? (
                                            <Badge bg="success">Sí</Badge>
                                        ) : (
                                            <Badge bg="warning">No</Badge>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserViewModal;
