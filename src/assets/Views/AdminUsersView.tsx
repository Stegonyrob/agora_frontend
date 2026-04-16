import React from 'react';
import { Container } from 'react-bootstrap';
import UserManager from '../Components/Blog/admin/users/UserManager';

const AdminUsersView: React.FC = () => {
    return (
        <Container fluid className="admin-users-view">
            <UserManager />
        </Container>
    );
};

export default AdminUsersView;
