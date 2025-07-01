import IUser from '@/core/user/IUser';
import IUserDTO from '@/core/user/IUserDTO';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Form, Row } from 'react-bootstrap';
import UserDeleteModal from './components/UserDeleteModal';
import UserEditModal from './components/UserEditModal';
import UserStats from './components/UserStats';
import UserTable from './components/UserTable';
import UserViewModal from './components/UserViewModal';
import { UserManagerService } from './services/UserManagerService';
import styles from './UserManager.module.scss';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    // Form data
    const [formData, setFormData] = useState<IUserDTO>({
        username: '',
        email: '',
        firstName: '',
        lastName1: '',
        lastName2: '',
        avatarId: null,
        acceptedRules: true,
        roles: ['ROLE_USER'],
        banReason: null,
        banned: false
    });

    const userManagerService = new UserManagerService();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const usersData = await userManagerService.loadUsers();
            setUsers(usersData);
        } catch (err) {
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (user: IUser) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName1: user.lastName1,
            lastName2: user.lastName2,
            avatarId: user.avatarId,
            acceptedRules: user.acceptedRules,
            roles: user.roles,
            banReason: user.banReason,
            banned: user.banned
        });
        setShowEditModal(true);
    };

    const handleDelete = (user: IUser) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            const userData = {
                username: formData.username || '',
                email: formData.email || '',
                firstName: formData.firstName || '',
                lastName1: formData.lastName1 || '',
                lastName2: formData.lastName2 || '',
                avatarId: formData.avatarId || undefined,
                acceptedRules: formData.acceptedRules,
                roles: formData.roles
            };

            await userManagerService.updateUser(selectedUser.id, userData);
            await loadUsers();
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (err: any) {
            setError(`Error al actualizar el usuario: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            await userManagerService.deleteUser(selectedUser.id);
            await loadUsers();
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            setShowDeleteModal(false);
            const shouldBan = window.confirm(
                `❌ No se puede eliminar el usuario "${selectedUser.fullName}".\n\n` +
                `¿Deseas BANEAR al usuario en su lugar?`
            );

            if (shouldBan) {
                try {
                    await userManagerService.banUser(selectedUser.id, 'Baneado por admin - Eliminación falló');
                    await loadUsers();
                    alert(`✅ Usuario "${selectedUser.fullName}" BANEADO exitosamente.`);
                } catch (banError: any) {
                    setError(`Error crítico: ${banError.message}`);
                }
            }
            setSelectedUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (user: IUser) => {
        const reason = window.prompt(`🚫 ¿Banear usuario "${user.fullName}"?\n\nIngresa la razón del baneo:`);
        if (!reason) return;

        try {
            setLoading(true);
            await userManagerService.banUser(user.id, reason);
            await loadUsers();
            alert(`🚫 Usuario "${user.fullName}" BANEADO exitosamente`);
        } catch (err: any) {
            setError(`Error al banear "${user.fullName}": ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReactivate = async (user: IUser) => {
        const confirmed = window.confirm(
            `🔓 ¿Reactivar usuario "${user.fullName}"?\n\nEl usuario podrá acceder al sistema nuevamente.`
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            await userManagerService.unbanUser(user.id);
            await loadUsers();
            alert(`✅ Usuario "${user.fullName}" REACTIVADO exitosamente`);
        } catch (err: any) {
            setError(`Error al reactivar "${user.fullName}": ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && users.length === 0) {
        return (
            <Container>
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando usuarios...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className={styles.userManager}>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">👥 Gestión de Usuarios</h4>
                                <Form.Control
                                    type="text"
                                    placeholder="🔍 Buscar usuario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '300px' }}
                                />
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <UserStats users={users} />

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            )}

                            <Alert variant="success" className="mb-3">
                                <Alert.Heading>✅ Panel de Administración de Usuarios</Alert.Heading>
                                <p className="mb-1">
                                    <strong>👁️ Ver:</strong> Muestra toda la información del usuario
                                </p>
                                <p className="mb-1">
                                    <strong>✏️ Editar:</strong> Permite cambiar nombre, apellidos, email y avatar
                                </p>
                                <p className="mb-1">
                                    <strong>� Banear:</strong> Bloquea el acceso del usuario al sistema
                                </p>
                                <p className="mb-1">
                                    <strong>� Reactivar:</strong> Restaura el acceso de un usuario baneado
                                </p>
                                <p className="mb-0">
                                    <strong>�️ Eliminar:</strong> Borra permanentemente al usuario del sistema
                                </p>
                            </Alert>

                            <UserTable
                                users={filteredUsers}
                                onView={handleView}
                                onEdit={handleEdit}
                                onBan={handleBanUser}
                                onReactivate={handleReactivate}
                                onDelete={handleDelete}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <UserViewModal
                show={showViewModal}
                user={selectedUser}
                onClose={() => setShowViewModal(false)}
            />

            <UserEditModal
                show={showEditModal}
                user={selectedUser}
                formData={formData}
                loading={loading}
                onFormChange={setFormData}
                onSave={handleSaveEdit}
                onClose={() => setShowEditModal(false)}
            />

            <UserDeleteModal
                show={showDeleteModal}
                user={selectedUser}
                loading={loading}
                onConfirm={handleConfirmDelete}
                onClose={() => setShowDeleteModal(false)}
            />
        </Container>
    );
};

export default UserManager;
