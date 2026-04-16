import IUser from '@/core/user/IUser';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

interface UserStatsProps {
    users: IUser[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
    const activeUsers = users.filter(user => !user.banned);
    const bannedUsers = users.filter(user => user.banned);
    const adminUsers = users.filter(user => user.roles.includes('ROLE_ADMIN'));

    return (
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
    );
};

export default UserStats;
