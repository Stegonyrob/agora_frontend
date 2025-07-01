import BannedService from '@/core/banned/BannedService';
import ProfileService from '@/core/profiles/ProfileService';
import IUser from '@/core/user/IUser';
import IUserDTO from '@/core/user/IUserDTO';
import UserService from '@/core/user/UserService';
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
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

    // Selected user
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

    const userService = new UserService();
    const profileService = new ProfileService();
    const bannedService = new BannedService();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Cargando usuarios...');
            const data = await userService.getAllUsers();
            console.log('📊 Datos recibidos del backend:', data);

            // Verificar que sea un array
            if (Array.isArray(data)) {
                // Enriquecer usuarios con información de baneo
                const enrichedUsers = await Promise.all(
                    data.map(async (user) => {
                        try {
                            const bannedInfo = await bannedService.getBannedByUserId(user.id);
                            if (bannedInfo) {
                                return {
                                    ...user,
                                    banned: true,
                                    banReason: bannedInfo.reason,
                                };
                            }
                            return {
                                ...user,
                                banned: false,
                                banReason: null,
                            };
                        } catch (error) {
                            console.warn(
                                `⚠️ No se pudo verificar estado de baneo para usuario ${user.id}:`,
                                error
                            );
                            return user;
                        }
                    })
                );

                setUsers(enrichedUsers);
                console.log(`✅ ${enrichedUsers.length} usuarios cargados exitosamente`);
            } else {
                console.error('❌ Los datos recibidos no son un array:', data);
                setError('Error: Los datos de usuarios no tienen el formato esperado');
                setUsers([]);
            }
        } catch (err: any) {
            console.error('❌ Error loading users:', err);
            setError('Error al cargar los usuarios');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

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

    const handleReactivate = async (user: IUser) => {
        if (!user.banned) return;

        const confirmed = window.confirm(
            `🔓 ¿Reactivar usuario?\n\n` +
            `Usuario: ${user.fullName}\n` +
            `Email: ${user.email}\n\n` +
            `El usuario podrá acceder al sistema nuevamente.`
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            console.log('✅ UserManager.handleReactivate - Usuario a reactivar:', user);

            // Obtener el registro de baneo
            const bannedRecord = await bannedService.getBannedByUserId(user.id);
            if (!bannedRecord || !bannedRecord.id) {
                throw new Error("Usuario no está baneado o no se encontró el registro");
            }

            // Eliminar el registro de baneo usando DELETE /api/v1/admin/banned/{id}
            await bannedService.unbanUser(bannedRecord.id);
            await loadUsers();

            alert(`✅ Usuario "${user.fullName}" REACTIVADO exitosamente`);

        } catch (err: any) {
            console.error('Error reactivating user:', err);

            let errorMessage = `❌ Error al reactivar "${user.fullName}"`;
            if (err.response?.status === 403) {
                errorMessage += '\n🔒 Sin permisos de administrador.';
            } else if (err.response?.status === 500) {
                errorMessage += '\n🔧 Error interno del servidor.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Nueva función para banear directamente
    const handleBanUser = async (user: IUser) => {
        if (user.banned) return;

        const reason = window.prompt(
            `🚫 ¿Banear usuario "${user.fullName}"?\n\n` +
            `Ingresa la razón del baneo:`
        );

        if (!reason) return;

        try {
            setLoading(true);
            console.log('🚫 UserManager.handleBanUser - Usuario a banear:', user);

            // Usar el servicio de baneo para crear el registro usando POST /api/v1/admin/banned
            await bannedService.banUser(user.id, reason);
            await loadUsers();

            alert(`🚫 Usuario "${user.fullName}" BANEADO exitosamente`);

        } catch (err: any) {
            console.error('Error banning user:', err);

            let errorMessage = `❌ Error al banear "${user.fullName}"`;
            if (err.response?.status === 403) {
                errorMessage += '\n🔒 Sin permisos de administrador.';
            } else if (err.response?.status === 500) {
                errorMessage += '\n🔧 Error interno del servidor.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);

            // Crear un objeto con los datos del usuario para actualizar
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

            console.log('📝 UserManager.handleSaveEdit - Datos del usuario a enviar:', userData);
            console.log('📝 UserManager.handleSaveEdit - Usuario seleccionado:', selectedUser);

            // Actualizar el usuario usando PUT /api/v1/any/user/{id}
            await userService.updateUser(selectedUser.id, userData);
            await loadUsers();
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (err: any) {
            console.error('Error updating user:', err);

            // Análisis más detallado del error
            let errorMessage = '❌ Error al actualizar el usuario';
            let canRetry = false;

            if (err.response?.status === 500) {
                errorMessage = `🔧 Error del servidor al actualizar "${selectedUser.fullName}".\n\nPosibles causas:\n• Datos inválidos\n• Restricciones de base de datos\n• Problemas de configuración del backend`;
                canRetry = true;
            } else if (err.response?.status === 403) {
                errorMessage = '🔒 Sin permisos para actualizar usuarios. Verifica que tengas rol de administrador.';
            } else if (err.response?.status === 404) {
                errorMessage = '👻 El usuario no existe o fue eliminado.';
            } else if (err.response?.status === 400) {
                errorMessage = '📝 Datos inválidos. Verifica que todos los campos estén correctos.';
                canRetry = true;
            } else if (err.response?.data?.message) {
                errorMessage = `Servidor: ${err.response.data.message}`;
            }

            // Si es un error que puede intentarse de nuevo, preguntamos
            if (canRetry && err.response?.status === 500) {
                const retry = window.confirm(
                    `${errorMessage}\n\n¿Deseas intentar con una versión simplificada de los datos?`
                );

                if (retry) {
                    try {
                        // Intentar con datos mínimos del usuario
                        const simpleUserData = {
                            firstName: formData.firstName || selectedUser.firstName || '',
                            email: selectedUser.email,
                        };

                        console.log('🔄 Intentando actualización simple del usuario:', simpleUserData);
                        await userService.updateUser(selectedUser.id, simpleUserData);
                        await loadUsers();
                        setShowEditModal(false);
                        setSelectedUser(null);
                        alert('✅ Usuario actualizado con datos simplificados');
                        return;

                    } catch (retryError) {
                        console.error('Error en reintento:', retryError);
                        errorMessage += '\n\n❌ El reintento también falló.';
                    }
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            console.log('🗑️ UserManager.handleConfirmDelete - Usuario a eliminar:', selectedUser);

            // Intentar eliminar el usuario completamente usando DELETE /api/v1/any/user/{id}
            await userService.deleteUser(selectedUser.id);
            await loadUsers();
            setShowDeleteModal(false);
            setSelectedUser(null);

        } catch (err: any) {
            console.error('Error deleting user:', err);
            setShowDeleteModal(false);

            // Dado que el backend tiene problemas constantes con la eliminación,
            // ofrecemos directamente la opción de banear
            const shouldBan = window.confirm(
                `❌ ERROR DEL SERVIDOR: No se puede eliminar el usuario "${selectedUser.fullName}".\n\n` +
                `🔧 SOLUCIÓN ALTERNATIVA:\n` +
                `¿Deseas BANEAR al usuario en su lugar?\n\n` +
                `• El usuario no podrá acceder al sistema\n` +
                `• Sus datos se conservarán\n` +
                `• Podrás reactivarlo más tarde`
            );

            if (shouldBan) {
                try {
                    // Usar el servicio de baneo como alternativa usando POST /api/v1/admin/banned
                    await bannedService.banUser(selectedUser.id, `Baneado por admin el ${new Date().toLocaleDateString()} - Eliminación falló`);
                    await loadUsers();
                    setSelectedUser(null);
                    alert(`✅ Usuario "${selectedUser.fullName}" BANEADO exitosamente.`);
                    return;

                } catch (banError: any) {
                    console.error('Error banning user:', banError);
                    let banErrorMsg = '❌ Error crítico: No se pudo ni eliminar ni banear al usuario.';

                    if (banError.response?.status === 403) {
                        banErrorMsg += '\n🔒 Sin permisos de administrador.';
                    } else if (banError.response?.status === 500) {
                        banErrorMsg += '\n🔧 Error interno del servidor.';
                    }

                    setError(banErrorMsg);
                }
            }

            setSelectedUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Estadísticas de usuarios
    const activeUsers = users.filter(user => !user.banned);
    const bannedUsers = users.filter(user => user.banned);
    const adminUsers = users.filter(user => user.roles.includes('ROLE_ADMIN'));

    const getRoleBadge = (roles: string[]) => {
        const isAdmin = roles.includes('ROLE_ADMIN');
        const variant = isAdmin ? 'danger' : 'primary';
        const text = isAdmin ? 'Admin' : 'Usuario';
        return <Badge bg={variant}>{text}</Badge>;
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
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="🔍 Buscar usuario..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ width: '300px' }}
                                    />
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Estadísticas */}
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="text-center p-2 bg-light rounded">
                                        <h5 className="mb-1 text-primary">{users.length}</h5>
                                        <small className="text-muted">👥 Total Usuarios</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-2 bg-light rounded">
                                        <h5 className="mb-1 text-success">{activeUsers.length}</h5>
                                        <small className="text-muted">✅ Activos</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-2 bg-light rounded">
                                        <h5 className="mb-1 text-warning">{bannedUsers.length}</h5>
                                        <small className="text-muted">🚫 Baneados</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-2 bg-light rounded">
                                        <h5 className="mb-1 text-danger">{adminUsers.length}</h5>
                                        <small className="text-muted">👑 Admins</small>
                                    </div>
                                </Col>
                            </Row>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                                    <div style={{ whiteSpace: 'pre-line' }}>{error}</div>
                                </Alert>
                            )}

                            {/* Aviso sobre endpoints utilizados */}
                            <Alert variant="info" className="mb-3">
                                <Alert.Heading>ℹ️ Endpoints de Gestión de Usuarios</Alert.Heading>
                                <p className="mb-1">
                                    <strong>✏️ Editar:</strong> PUT /api/v1/any/user/{`{id}`} - Actualiza datos del usuario
                                </p>
                                <p className="mb-1">
                                    <strong>🚫 Banear:</strong> POST /api/v1/admin/banned - Registra usuario baneado
                                </p>
                                <p className="mb-1">
                                    <strong>🗑️ Eliminar:</strong> DELETE /api/v1/any/user/{`{id}`} - Derecho al olvido (GDPR)
                                </p>
                                <p className="mb-0">
                                    <strong>🔓 Reactivar:</strong> DELETE /api/v1/admin/banned/{`{bannedId}`} - Elimina registro de baneo
                                </p>
                            </Alert>

                            <div className="table-responsive">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Avatar</th>
                                            <th>Nombre</th>
                                            <th>Usuario</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className={user.banned ? 'table-warning' : ''}>
                                                <td>
                                                    <img
                                                        src={user.avatarUrl || '/images/avatarGeneric.png'}
                                                        alt={user.fullName}
                                                        className={styles.avatar}
                                                        width="40"
                                                        height="40"
                                                    />
                                                </td>
                                                <td>{user.fullName}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{getRoleBadge(user.roles)}</td>
                                                <td>
                                                    {user.banned ? (
                                                        <Badge bg="danger" title={user.banReason || 'Usuario baneado'}>
                                                            🚫 Baneado
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="success">✅ Activo</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => handleView(user)}
                                                            title="Ver detalles"
                                                        >
                                                            👁️
                                                        </Button>
                                                        <Button
                                                            variant="outline-warning"
                                                            size="sm"
                                                            onClick={() => handleEdit(user)}
                                                            title="Editar usuario"
                                                        >
                                                            ✏️
                                                        </Button>
                                                        {user.banned ? (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => handleReactivate(user)}
                                                                title="Reactivar usuario"
                                                            >
                                                                🔓 Reactivar
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    onClick={() => handleBanUser(user)}
                                                                    title="Banear usuario"
                                                                >
                                                                    🚫 Banear
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(user)}
                                                                    title="Eliminar usuario completamente (GDPR)"
                                                                >
                                                                    🗑️
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-muted">
                                            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Ver Usuario */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>👁️ Detalles del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Row>
                            <Col md={4} className="text-center">
                                <img
                                    src={selectedUser.avatarUrl || '/images/avatarGeneric.png'}
                                    alt={selectedUser.fullName}
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ maxWidth: '150px' }}
                                />
                            </Col>
                            <Col md={8}>
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td><strong>ID:</strong></td>
                                            <td>{selectedUser.id}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Nombre:</strong></td>
                                            <td>{selectedUser.fullName}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Usuario:</strong></td>
                                            <td>{selectedUser.username}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Email:</strong></td>
                                            <td>{selectedUser.email}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Rol:</strong></td>
                                            <td>{getRoleBadge(selectedUser.roles)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Avatar ID:</strong></td>
                                            <td>{selectedUser.avatarId || 'Sin avatar'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Estado:</strong></td>
                                            <td>
                                                {selectedUser.banned ? (
                                                    <Badge bg="danger">Baneado</Badge>
                                                ) : (
                                                    <Badge bg="success">Activo</Badge>
                                                )}
                                            </td>
                                        </tr>
                                        {selectedUser.banReason && (
                                            <tr>
                                                <td><strong>Razón del baneo:</strong></td>
                                                <td>{selectedUser.banReason}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><strong>Reglas aceptadas:</strong></td>
                                            <td>
                                                {selectedUser.acceptedRules ? (
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
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Editar Usuario */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
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
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.lastName1 || ''}
                                        onChange={(e) => setFormData({ ...formData, lastName1: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, lastName2: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.username || ''}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rol</Form.Label>
                                    <Form.Select
                                        value={formData.roles?.[0] || 'ROLE_USER'}
                                        onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                                    >
                                        <option value="ROLE_USER">Usuario</option>
                                        <option value="ROLE_ADMIN">Administrador</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Avatar ID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.avatarId || ''}
                                        onChange={(e) => setFormData({ ...formData, avatarId: e.target.value ? Number(e.target.value) : null })}
                                        placeholder="ID del avatar"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={formData.banned ? 'banned' : 'active'}
                                        onChange={(e) => setFormData({ ...formData, banned: e.target.value === 'banned' })}
                                    >
                                        <option value="active">Activo</option>
                                        <option value="banned">Baneado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        {formData.banned && (
                            <Form.Group className="mb-3">
                                <Form.Label>Razón del baneo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.banReason || ''}
                                    onChange={(e) => setFormData({ ...formData, banReason: e.target.value })}
                                    placeholder="Razón por la cual se banea al usuario"
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>🗑️ Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p>¿Estás seguro de que quieres eliminar al usuario?</p>
                            <div className="alert alert-warning">
                                <strong>Nombre:</strong> {selectedUser.fullName}<br />
                                <strong>Email:</strong> {selectedUser.email}<br />
                                <strong>Usuario:</strong> {selectedUser.username}
                            </div>
                            <p className="text-danger">
                                <strong>⚠️ Esta acción no se puede deshacer.</strong>
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManager;
