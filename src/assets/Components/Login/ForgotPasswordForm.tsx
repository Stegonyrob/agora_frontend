import React, { useState } from "react";
import styles from "./FormLogin.module.scss";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
    onRequest: (email: string) => Promise<void>;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin, onRequest }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onRequest(email);
            setSubmitted(true);
        } catch (err: any) {
            setError("Ocurrió un error. Intenta de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.formContainer}>
                <h2>Recuperar contraseña</h2>
                <p>Si el email existe, recibirás instrucciones para restablecer tu contraseña.</p>
                <button onClick={onBackToLogin} className="btn btn-primary">Volver al login</button>
            </div>
        );
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2>Recuperar contraseña</h2>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                </button>
                <button type="button" className="btn btn-link" onClick={onBackToLogin}>
                    Volver al login
                </button>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
