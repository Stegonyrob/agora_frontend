import React, { useState } from "react";

interface ResetPasswordFormProps {
    token: string;
    onReset: (token: string, newPassword: string) => Promise<void>;
}

const validatePassword = (password: string) => {
    // Puedes ajustar los requisitos mínimos aquí
    return password.length >= 8;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, onReset }) => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!validatePassword(password)) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        try {
            await onReset(token, password);
            setSuccess(true);
        } catch (err: any) {
            setError("El enlace es inválido o expiró. Intenta solicitarlo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="form-container">
                <h2>Contraseña restablecida</h2>
                <p>Tu contraseña ha sido cambiada correctamente. Ahora puedes iniciar sesión.</p>
                <a href="/login" className="btn btn-primary">Ir al login</a>
            </div>
        );
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Restablecer contraseña</h2>
            <div className="form-group">
                <label htmlFor="password">Nueva contraseña</label>
                <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirm">Confirmar contraseña</label>
                <input
                    id="confirm"
                    type="password"
                    className="form-control"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Cambiando..." : "Cambiar contraseña"}
                </button>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
