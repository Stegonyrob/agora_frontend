import AdminService from '@/core/admin/AdminService';
import React, { useEffect, useState } from 'react';
import styles from './AdminManager.module.scss';
import UserDeleteModal from './components/UserDeleteModal';
import UserTable from './components/UserTable';

interface AdminUser {
    id: number;
    username: string;
    email: string;
    roles: string[];
}


const AdminManager: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });

    // Comprobar si el usuario es admin
    const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('role') === 'ROLE_ADMIN';
    if (!isAdmin) return null;


    const adminService = new AdminService();

    useEffect(() => {
        console.log('[AdminManager] useEffect: Cargando admins...');
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('[AdminManager] Llamando a adminService.getAllAdmins()...');
            const admins = await adminService.getAllAdmins();
            console.log('[AdminManager] Respuesta de getAllAdmins:', admins);
            setAdmins(admins);
        } catch (err: any) {
            console.error('[AdminManager] Error al cargar administradores:', err);
            setError(err.message || 'Error al cargar administradores');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await adminService.createAdmin(form as any);
            setForm({ username: '', email: '', password: '', phone: '' });
            await loadAdmins();
        } catch (err: any) {
            setError(err.message || 'Error al crear admin');
        }
    };

    const handleDelete = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAdmin) return;
        setError(null);
        try {
            await adminService.deleteAdmin(selectedAdmin.id);
            setShowDeleteModal(false);
            setSelectedAdmin(null);
            await loadAdmins();
        } catch (err: any) {
            setError(err.message || 'Error al eliminar admin');
        }
    };

    // Solo mostrar admins
    const adminList = admins.filter(a => {
        const isAdmin = a.roles && a.roles.includes('ROLE_ADMIN');
        if (!isAdmin) {
            console.log('[AdminManager] Usuario filtrado por roles:', a);
        }
        return isAdmin;
    });
    console.log('[AdminManager] adminList final:', adminList);

    return (
        <div className={styles.adminManagerWrapper}>
            <div className={styles.adminCard}>
                <div className={styles.adminHeader}>
                    <h4 className={styles.adminTitle}>👑 Gestión de Administradores</h4>
                </div>
                <div className={styles.adminBody}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    <form onSubmit={handleCreate} className={styles.adminForm}>
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                required
                                className={styles.input}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                className={styles.input}
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.submitButtonContainer}>
                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                Crear Admin
                            </button>
                        </div>
                    </form>
                    <UserTable
                        users={adminList as any}
                        onView={() => { }}
                        onEdit={() => { }}
                        onDelete={handleDelete}
                        onBan={() => { }}
                        onReactivate={() => { }}
                    />
                </div>
            </div>
            <UserDeleteModal
                show={showDeleteModal}
                user={selectedAdmin as any}
                loading={loading}
                onConfirm={handleConfirmDelete}
                onClose={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default AdminManager;
