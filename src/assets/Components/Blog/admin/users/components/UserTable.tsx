import IUser from '@/core/user/IUser';
import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import styles from '../UserManager.module.scss';
import UserActionButtons from './UserActionButtons';

interface UserTableProps {
    users: IUser[];
    onView: (user: IUser) => void;
    onEdit: (user: IUser) => void;
    onBan: (user: IUser) => void;
    onReactivate: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    onView,
    onEdit,
    onBan,
    onReactivate,
    onDelete,
}) => {
    const getRoleBadge = (roles: string[]) => {
        const isAdmin = roles.includes('ROLE_ADMIN');
        const variant = isAdmin ? 'danger' : 'primary';
        const text = isAdmin ? 'Admin' : 'Usuario';
        return <Badge bg={variant}>{text}</Badge>;
    };

    if (users.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">No hay usuarios registrados</p>
            </div>
        );
    }

    return (
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
                    {users.map((user) => (
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
                                <UserActionButtons
                                    user={user}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onBan={onBan}
                                    onReactivate={onReactivate}
                                    onDelete={onDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;
