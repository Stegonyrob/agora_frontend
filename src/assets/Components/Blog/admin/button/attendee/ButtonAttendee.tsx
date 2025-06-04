import AttendeeService from "@/core/attendees/AttendeeService";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./ButtonAttendee.module.scss";
interface ButtonAttendeeProps {
    eventId: number;
    onRegister?: () => void;
    maxCapacity: number; // Add maxCapacity as a required prop
}
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const sanitizeInput = (input: string) => input.replace(/[<>'";]/g, "").trim();
const ButtonAttendee: React.FC<ButtonAttendeeProps> = ({ eventId, onRegister, maxCapacity }) => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userAttendeeId, setUserAttendeeId] = useState<number | null>(null);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [attendees, setAttendees] = useState(0);
    // Busca si el usuario ya está registrado por correo/teléfono
    const checkIfRegistered = async (correo: string, telefono: string) => {
        try {
            const attendeeService = new AttendeeService();
            const attendees = await attendeeService.getAttendees(eventId);
            const found = attendees.find(
                (a: any) =>
                    (a.email === correo && correo !== "") ||
                    (a.phone === telefono && telefono !== "")
            );
            if (found) {
                setUserAttendeeId(found.id);
                setAlreadyRegistered(true);
            } else {
                setUserAttendeeId(null);
                setAlreadyRegistered(false);
            }
        } catch {
            setUserAttendeeId(null);
            setAlreadyRegistered(false);
        }
    };

    useEffect(() => {
        const fetchAttendees = async () => {
            const attendeeService = new AttendeeService();
            const list = await attendeeService.getAttendees(eventId);
            setAttendees(list.length);
        };
        fetchAttendees();
    }, [eventId, success]);

    const availableSpots = Math.max(maxCapacity - attendees, 0);
    // Handler for ReCAPTCHA change
    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizeInput(e.target.value);
        setForm({ ...form, [e.target.name]: value });

        // Si cambia correo o teléfono, busca si ya está registrado
        if (e.target.name === "correo" || e.target.name === "telefono") {
            checkIfRegistered(
                e.target.name === "correo" ? value : form.correo,
                e.target.name === "telefono" ? value : form.telefono
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            if (!captchaToken) {
                setError("Por favor, verifica que no eres un robot.");
                setLoading(false);
                return;
            }
            const attendeeService = new AttendeeService();
            const sanitizedForm = {
                name: sanitizeInput(form.nombre),
                email: sanitizeInput(form.correo),
                phone: sanitizeInput(form.telefono),
            };
            const response = await attendeeService.registerAttendee(eventId, sanitizedForm, captchaToken);
            if (response && response.id) setUserAttendeeId(response.id);
            setSuccess(true);
            setForm({ nombre: "", correo: "", telefono: "" });
            if (onRegister) onRegister();
            setTimeout(() => setShowModal(false), 1500);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError("Ya existe un registro con ese correo o teléfono para este evento.");
            } else if (err.response?.status === 403) {
                setError("Captcha inválido. Por favor, verifica que no eres un robot.");
            } else {
                setError(err.message || "No se pudo registrar.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleDismiss = async () => {
        if (!userAttendeeId) return;
        setLoading(true);
        setError("");
        try {
            const attendeeService = new AttendeeService();
            await attendeeService.deleteAttendee(eventId, userAttendeeId);
            setSuccess(true);
            setUserAttendeeId(null);
            if (onRegister) onRegister();
            setTimeout(() => setShowModal(false), 1500);
        } catch (err: any) {
            setError(err.message || "No se pudo eliminar el registro.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setError("");
        setSuccess(false);
        setUserAttendeeId(null);
        setForm({ nombre: "", correo: "", telefono: "" });
    };

    return (

        <div className={styles.attendeeBlock}>
            <div className={styles.counters}>
                <span className={styles.attendees}>
                    <i className="bi bi-people-fill"></i> {attendees} asistentes
                </span>
                <span className={availableSpots > 0 ? styles.available : styles.full}>
                    {availableSpots > 0
                        ? `🟢 ${availableSpots} lugares`
                        : "🔴 Evento lleno"}
                </span>
            </div>
            <Button
                className={styles.attendButton}
                onClick={handleOpenModal}
                disabled={availableSpots === 0}
            >
                {availableSpots > 0 ? "Asistir" : "Lleno"}
            </Button>
            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <form
                        onSubmit={handleSubmit}
                        style={{ background: "#fff", padding: 20, borderRadius: 8, minWidth: 300 }}
                    >
                        <h2>Registro de Asistente</h2>
                        <input
                            name="nombre"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            style={{ display: "block", marginBottom: 10, width: "100%" }}
                        />
                        <input
                            name="correo"
                            type="email"
                            placeholder="Correo"
                            value={form.correo}
                            onChange={handleChange}
                            required
                            style={{ display: "block", marginBottom: 10, width: "100%" }}
                        />
                        <input
                            name="telefono"
                            placeholder="Teléfono"

                        />
                        <ReCAPTCHA
                            sitekey={siteKey}
                            onChange={handleCaptchaChange}
                        />
                        {alreadyRegistered && (
                            <div style={{ color: "orange", marginBottom: 10 }}>
                                Ya estás registrado para este evento.
                            </div>
                        )}
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {success && <div style={{ color: "green" }}>¡Registro exitoso!</div>}
                        <button
                            type="submit"
                            disabled={loading || alreadyRegistered}
                        >
                            {loading ? "Registrando..." : "Registrar"}
                        </button>
                        <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: 10 }}>
                            Cancelar
                        </button>
                        {userAttendeeId && (
                            <button
                                type="button"
                                style={{ marginTop: 10, color: "red" }}
                                onClick={handleDismiss}
                                disabled={loading}
                            >
                                Darse de baja del evento
                            </button>
                        )}
                    </form>
                </div>
            )
            }
        </div>
    );
};

export default ButtonAttendee;