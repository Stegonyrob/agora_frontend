import AdminService from "@/core/admin/AdminService";
import { IAdmin } from "@/core/admin/IAdmin";
import { IAdminDTO } from "@/core/admin/IAdminDTO";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./AdminManager.module.scss";
import UserDeleteModal from "./components/UserDeleteModal";
import UserTable from "./components/UserTable";

const AdminManager: React.FC = () => {
    const [admins, setAdmins] = useState<IAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<IAdmin | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        firstName: "",
        lastName1: "",
        lastName2: "", // único opcional
    });

    // Comprobar si el usuario es admin
    const isAdmin =
        typeof window !== "undefined" &&
        sessionStorage.getItem("role") === "ROLE_ADMIN";
    if (!isAdmin) return null;

    const adminService = new AdminService();

    useEffect(() => {
        console.log("[AdminManager] useEffect: Cargando admins...");
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("[AdminManager] Llamando a adminService.getAllAdmins()...");
            const admins = await adminService.getAllAdmins();
            console.log("[AdminManager] Respuesta de getAllAdmins:", admins);
            setAdmins(admins);
        } catch (err: any) {
            console.error("[AdminManager] Error al cargar administradores:", err);
            setError(err.message || "Error al cargar administradores");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Crear payload con campos del formulario + campos requeridos por backend
            const payload: IAdminDTO = {
                username: form.username,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
                phone: form.phone,
                firstName: form.firstName,
                lastName1: form.lastName1,
                lastName2: form.lastName2 || "", // del formulario o vacío
                // Campos adicionales requeridos por backend (vacíos)
                city: "",
                country: "",
                relationship: "",
                avatarId: null,
            };

            console.log(
                "[AdminManager] handleCreate - Datos enviados al backend:",
                payload
            );
            await adminService.createAdmin(payload);

            // Limpiar formulario después de crear exitosamente
            setForm({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                firstName: "",
                lastName1: "",
                lastName2: "", // único opcional
            });

            await loadAdmins();
        } catch (err: any) {
            console.error("[AdminManager] Error al crear admin:", err);
            setError(err.message || "Error al crear admin");
        }
    };

    const handleDelete = (admin: IAdmin) => {
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
            setError(err.message || "Error al eliminar admin");
        }
    };

    // Convertir los admins al formato esperado por UserTable
    // Ya no necesitamos filtrar porque el backend solo devuelve admins
    const adminList: import("@/core/user/IUser").default[] = useMemo(() => {
        const mappedList = admins.map((admin) => ({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            roles: admin.roles || ["ROLE_ADMIN"],
            avatarUrl: admin.avatarUrl || "/images/avatars/onron.png",
            fullName: admin.fullName || `${admin.firstName || ''} ${admin.lastName1 || ''}`.trim() || admin.username,
            acceptedRules: admin.acceptedRules ?? true,
            firstName: admin.firstName || null,
            lastName1: admin.lastName1 || null,
            lastName2: admin.lastName2 || null,
            avatarId: admin.avatarId || null,
            avatarDisplayName: admin.avatarDisplayName || null,
            banReason: admin.banReason || null,
            banned: admin.banned ?? false,
            admin: admin.admin ?? true,
        }));

        // Solo log cuando hay cambios reales en los datos (evita spam en consola)
        console.log("[AdminManager] adminList recalculado:", mappedList.length, "admins");
        return mappedList;
    }, [admins]); // Solo se recalcula cuando cambian los admins, no en cada keystroke

    // Funciones de callback memorizadas para evitar re-renders innecesarios
    const handleView = useCallback((user: any) => {
        console.log("[AdminManager] Ver info admin:", user);
        alert("Info admin: " + (user.fullName || user.username));
    }, []);

    const handleEdit = useCallback((user: any) => {
        console.log("[AdminManager] Editar admin:", user);
        alert("Editar admin: " + (user.fullName || user.username));
    }, []);

    const handleBan = useCallback(() => {
        // Empty function for now
    }, []);

    const handleReactivate = useCallback(() => {
        // Empty function for now
    }, []);

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
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, firstName: e.target.value }))
                                    }
                                    required
                                    className={styles.input}
                                    id="firstName"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Primer apellido *</label>
                                <input
                                    type="text"
                                    placeholder="Primer apellido"
                                    value={form.lastName1}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, lastName1: e.target.value }))

                                    }
                                    required
                                    className={styles.input}
                                    id="lastName1"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Segundo apellido (opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Segundo apellido (opcional)"
                                    value={form.lastName2}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, lastName2: e.target.value }))
                                    }
                                    className={styles.input}
                                    id="lastName2"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre de Usuario *</label>
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, username: e.target.value }))
                                    }
                                    required
                                    className={styles.input}
                                    id="username"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, email: e.target.value }))
                                    }
                                    required
                                    className={styles.input}
                                    id="email"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Teléfono *</label>
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, phone: e.target.value }))
                                    }
                                    required
                                    className={styles.input}
                                    id="phone"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="admin-password" className={styles.label}>
                                    Contraseña *
                                </label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, password: e.target.value }))
                                        }
                                        required
                                        placeholder="Contraseña"
                                        className={styles.passwordInput}
                                        autoComplete="new-password"
                                    />
                                    <i
                                        className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"
                                            } ${styles.showPasswordIconOne}`}
                                        onClick={() => setShowPassword((v) => !v)}
                                        tabIndex={0}
                                        aria-label={
                                            showPassword ? "Ocultar contraseña" : "Ver contraseña"
                                        }
                                        role="button"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Confirmar Contraseña *
                                </label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="admin-confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                confirmPassword: e.target.value,
                                            }))
                                        }
                                        required
                                        placeholder="Confirmar Contraseña"
                                        className={styles.passwordInput}
                                        autoComplete="new-password"
                                    />
                                    <i
                                        className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"
                                            } ${styles.showPasswordIconTwo}`}
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        tabIndex={0}
                                        aria-label={
                                            showConfirmPassword
                                                ? "Ocultar contraseña"
                                                : "Ver contraseña"
                                        }
                                        role="button"
                                    />
                                </div>
                            </div>
                        </div>
                        <div> <p>* Campos obligatorios</p></div>
                        <div className={styles.submitButtonContainer}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                Crear Admin
                            </button>
                        </div>
                    </form>
                    <UserTable
                        users={adminList as any}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onBan={handleBan}
                        onReactivate={handleReactivate}
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
