import IUser from '@/core/user/IUser';
import IUserDTO from '@/core/user/IUserDTO';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

interface UserEditModalProps {
    show: boolean;
    user: IUser | null;
    formData: IUserDTO;
    loading: boolean;
    onFormChange: (formData: IUserDTO) => void;
    onSave: () => void;
    onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    show,
    user,
    formData,
    loading,
    onFormChange,
    onSave,
    onClose,
}) => {
    if (!user) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>✏️ Editar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.firstName || ''}
                                    onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.lastName1 || ''}
                                    onChange={(e) => onFormChange({ ...formData, lastName1: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.lastName2 || ''}
                                    onChange={(e) => onFormChange({ ...formData, lastName2: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.username || ''}
                                    onChange={(e) => onFormChange({ ...formData, username: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    value={formData.roles?.[0] || 'ROLE_USER'}
                                    onChange={(e) => onFormChange({ ...formData, roles: [e.target.value] })}
                                >
                                    <option value="ROLE_USER">Usuario</option>
                                    <option value="ROLE_ADMIN">Administrador</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Avatar ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.avatarId || ''}
                                    onChange={(e) => onFormChange({ ...formData, avatarId: e.target.value ? Number(e.target.value) : null })}
                                    placeholder="ID del avatar"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={onSave} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserEditModal;
