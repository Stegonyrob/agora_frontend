import IUser from '@/core/user/IUser';
import React from 'react';
import { Button } from 'react-bootstrap';

interface UserActionButtonsProps {
    user: IUser;
    onView: (user: IUser) => void;
    onEdit: (user: IUser) => void;
    onBan: (user: IUser) => void;
    onReactivate: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
    user,
    onView,
    onEdit,
    onBan,
    onReactivate,
    onDelete,
}) => {
    return (
        <div className="d-flex gap-1">
            <Button
                variant="outline-info"
                size="sm"
                onClick={() => onView(user)}
                title="Ver detalles"
            >
                👁️
            </Button>
            <Button
                variant="outline-warning"
                size="sm"
                onClick={() => onEdit(user)}
                title="Editar usuario"
            >
                ✏️
            </Button>
            {user.banned ? (
                <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onReactivate(user)}
                    title="Reactivar usuario"
                >
                    🔓
                </Button>
            ) : (
                <>
                    <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => onBan(user)}
                        title="Banear usuario"
                    >
                        🚫
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(user)}
                        title="Eliminar usuario completamente (GDPR)"
                    >
                        🗑️
                    </Button>
                </>
            )}
        </div>
    );
};

export default UserActionButtons;
