import Challenge from "@/assets/Components/Challenge/Challenge";
import AttendeeService from "@/core/attendees/AttendeeService";
import { sanitizeInput } from "@/utils/validationUtils";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import styles from "./ButtonAttendee.module.scss";

interface ButtonAttendeeProps {
    eventId: number;
    onRegister?: () => void;
    maxCapacity: number;
}

const ButtonAttendee: React.FC<ButtonAttendeeProps> = ({ eventId, onRegister, maxCapacity }) => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userAttendeeId, setUserAttendeeId] = useState<number | null>(null);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [attendees, setAttendees] = useState(0);
    const [challengeOk, setChallengeOk] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        if (!challengeOk) {
            setError("Por favor, resuelve el desafío correctamente.");
            setLoading(false);
            return;
        }

        try {
            const attendeeService = new AttendeeService();
            const sanitizedForm = {
                name: sanitizeInput(form.nombre),
                email: sanitizeInput(form.correo),
                phone: sanitizeInput(form.telefono),
            };
            const response = await attendeeService.registerAttendee(eventId, sanitizedForm, "");
            if (response && response.id) setUserAttendeeId(response.id);
            setSuccess(true);
            setForm({ nombre: "", correo: "", telefono: "" });
            if (onRegister) onRegister();
            setTimeout(() => setShowModal(false), 1500);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError("Ya existe un registro con ese correo o teléfono para este evento.");
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
        setChallengeOk(false);
    };

    const availableSpots = Math.max(maxCapacity - attendees, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizeInput(e.target.value);
        setForm({ ...form, [e.target.name]: value });

        if (e.target.name === "correo" || e.target.name === "telefono") {
            checkIfRegistered(
                e.target.name === "correo" ? value : form.correo,
                e.target.name === "telefono" ? value : form.telefono
            );
        }
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
            <Modal className={styles.modalCard} show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header className={styles.modalHeader} closeButton>
                    <Modal.Title>Registro de Asistente</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                placeholder="Correo"
                                value={form.correo}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                placeholder="Teléfono"
                                value={form.telefono}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Challenge onVerify={setChallengeOk} />
                        {alreadyRegistered && (
                            <div className={styles.alreadyRegistered}>
                                Ya estás registrado para este evento.
                            </div>
                        )}
                        {error && <div className={styles.error}>{error}</div>}
                        {success && <div className={styles.success}>¡Registro exitoso!</div>}
                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading || alreadyRegistered || !challengeOk}
                            >
                                {loading ? "Registrando..." : "Registrar"}
                            </Button>
                        </div>
                        {userAttendeeId && (
                            <Button
                                variant="danger"
                                type="button"
                                onClick={handleDismiss}
                                disabled={loading}
                                className="mt-3"
                            >
                                Darse de baja del evento
                            </Button>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ButtonAttendee;