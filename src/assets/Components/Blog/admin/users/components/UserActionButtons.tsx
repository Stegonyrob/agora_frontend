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
                style={{ borderRadius: '0.3rem', minWidth: '2.2rem', minHeight: '2.2rem', padding: 0 }}
            >
                <i className="bi bi-info-lg" style={{ fontSize: '1.3rem', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}></i>
            </Button>
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(user)}
                title="Editar usuario"
                style={{ borderRadius: '0.3rem', minWidth: '2.2rem', minHeight: '2.2rem', padding: 0 }}
            >
                <i className="bi bi-vector-pen" style={{ fontSize: '1.3rem', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}></i>
            </Button>
            {user.banned ? (
                <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onReactivate(user)}
                    title="Reactivar usuario"
                    style={{ borderRadius: '0.3rem', minWidth: '2.2rem', minHeight: '2.2rem', padding: 0 }}
                >
                    <i className="bi bi-unlock" style={{ fontSize: '1.3rem', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}></i>
                </Button>
            ) : (
                <>
                    <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => onBan(user)}
                        title="Desactivar admin"
                        style={{ borderRadius: '0.3rem', minWidth: '2.2rem', minHeight: '2.2rem', padding: 0 }}
                    >
                        <i className="bi bi-power" style={{ fontSize: '1.3rem', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}></i>
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(user)}
                        title="Eliminar usuario completamente (GDPR)"
                        style={{ borderRadius: '0.3rem', minWidth: '2.2rem', minHeight: '2.2rem', padding: 0 }}
                    >
                        <i className="bi bi-x" style={{ fontSize: '1.3rem', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}></i>
                    </Button>
                </>
            )}
        </div>
    );
};

export default UserActionButtons;
