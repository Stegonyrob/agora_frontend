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

const UserTable: React.FC<UserTableProps> = React.memo(({
    users,
    onView,
    onEdit,
    onBan,
    onReactivate,
    onDelete,
}) => {
    // console.log('[UserTable] users prop:', users); // Removido para evitar spam

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
        <div className={styles.userManager}>
            <div className="table-responsive">
                <Table striped hover className={styles.table}>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th className={styles.actionsCell}>Acciones</th>
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
                                <td>{user.fullName || user.username}</td>
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
                                <td className={styles.actionsCell}>
                                    <div className={styles.actionButtons}>
                                        <UserActionButtons
                                            user={user}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onBan={onBan}
                                            onReactivate={onReactivate}
                                            onDelete={onDelete}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
});

export default UserTable;
