import AdminService from "@/core/admin/AdminService";
import React, { useEffect, useState } from "react";
import styles from "./AdminManager.module.scss";
import UserDeleteModal from "./components/UserDeleteModal";
import UserTable from "./components/UserTable";

interface AdminUser {
    id: number;
    username: string;
    email: string;
    roles: string[];
    admin?: boolean; // Permite compatibilidad con backend que retorna 'admin: true'
    avatarUrl?: string | null;
    fullName?: string;
    acceptedRules?: boolean;
    firstName?: string | null;
    lastName1?: string | null;
    lastName2?: string | null;
    avatarId?: number | null;
    avatarDisplayName?: string | null;
    banReason?: string | null;
    banned?: boolean;
}

const AdminManager: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

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
        lastName2: "", // opcional
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
            // Map profile fields to root for each admin
            const mappedAdmins = admins.map((admin: any) => ({
                ...admin,
                ...(admin.profile || {}),
            }));
            console.log(
                "[AdminManager] Respuesta de getAllAdmins (mapeada):",
                mappedAdmins
            );
            setAdmins(mappedAdmins);
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
        // Construir el objeto con el formato requerido por backend
        const payload = {
            username: form.username,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            phone: form.phone,
            firstName: form.firstName,
            lastName1: form.lastName1,
            lastName2: form.lastName2,
        };
        try {
            console.log(
                "[AdminManager] handleCreate - Datos enviados al backend:",
                payload
            );
            await adminService.createAdmin(payload);
            setForm({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName1: "",
                lastName2: "",
                phone: "",
            });
            await loadAdmins();
        } catch (err: any) {
            setError(err.message || "Error al crear admin");
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
            setError(err.message || "Error al eliminar admin");
        }
    };

    // Solo mostrar admins (corrige para incluir los que tienen admin: true)
    // Mapea los admins para que tengan avatar y nombre correctos
    const adminList: import("@/core/user/IUser").default[] = admins
        .map((a) => ({
            ...a,
            roles:
                a.roles && a.roles.length > 0 ? a.roles : a.admin ? ["ROLE_ADMIN"] : [],
            avatarUrl:
                a.avatarUrl && a.avatarUrl !== null
                    ? a.avatarUrl
                    : a.admin
                        ? "/images/avatars/onron.png"
                        : "/images/avatarGeneric.png",
            fullName: a.fullName || a.username,
            acceptedRules: a.acceptedRules ?? true,
            firstName: a.firstName ?? null,
            lastName1: a.lastName1 ?? null,
            lastName2: a.lastName2 ?? null,
            avatarId: a.avatarId ?? null,
            avatarDisplayName: a.avatarDisplayName ?? null,
            banReason: a.banReason ?? null,
            banned: a.banned ?? false,
            admin: a.admin ?? true,
        }))
        .filter((a) => a.roles.includes("ROLE_ADMIN"));
    console.log("[AdminManager] adminList final:", adminList);

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
                                <label className={styles.label} >Nombre de Usuario *</label>
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
                            <div className={styles.formGroup}>
                                <label className={styles.label}>

                                    Confirmar Contraseña *
                                </label>

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
                                    tabIndex={-1}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Ocultar contraseña"
                                            : "Ver contraseña"
                                    }
                                />


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
                        onView={(user) => {
                            console.log("[AdminManager] Ver info admin:", user);
                            alert("Info admin: " + (user.fullName || user.username));
                        }}
                        onEdit={(user) => {
                            console.log("[AdminManager] Editar admin:", user);
                            alert("Editar admin: " + (user.fullName || user.username));
                        }}
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
