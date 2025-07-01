import { AttendeeService } from '@/core/attendees/AttendeeService';
import { IAttendee } from '@/core/attendees/IAttendee';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import styles from './AttendeesListModal.module.scss';

interface AttendeesListModalProps {
    show: boolean;
    onHide: () => void;
    eventId: number;
    eventTitle: string;
}

const AttendeesListModal: React.FC<AttendeesListModalProps> = ({
    show,
    onHide,
    eventId,
    eventTitle
}) => {
    const [attendees, setAttendees] = useState<IAttendee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (show) {
            fetchAttendees();
        }
    }, [show, eventId]);

    const fetchAttendees = async () => {
        setLoading(true);
        setError('');
        try {
            const attendeeService = new AttendeeService();
            const attendeesData = await attendeeService.getAttendees(eventId);
            setAttendees(attendeesData);
        } catch (err: any) {
            console.error('Error fetching attendees:', err);
            setError('Error al cargar la lista de inscritos.');
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (attendees.length === 0) {
            alert('No hay inscritos para exportar.');
            return;
        }

        // Preparar los datos para el Excel
        const dataForExcel = attendees.map((attendee, index) => ({
            'Nº': index + 1,
            'Nombre': attendee.name,
            'Email': attendee.email,
            'Teléfono': (attendee as any).phone || 'No proporcionado',
            'Fecha de Inscripción': new Date(attendee.registeredAt).toLocaleString('es-ES')
        }));

        // Crear el libro de trabajo
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();

        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos');

        // Crear el nombre del archivo
        const fileName = `Inscritos_${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Descargar el archivo
        XLSX.writeFile(workbook, fileName);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" className={styles.modal}>
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>
                    <i className="bi bi-people-fill me-2"></i>
                    Inscritos al Evento: {eventTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {loading && (
                    <div className="text-center p-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                        <p className="mt-2">Cargando lista de inscritos...</p>
                    </div>
                )}

                {error && (
                    <div className={`alert alert-danger ${styles.errorAlert}`}>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className={styles.statsBar}>
                            <span className={styles.totalCount}>
                                <i className="bi bi-person-check-fill me-1"></i>
                                Total de inscritos: <strong>{attendees.length}</strong>
                            </span>
                            <Button
                                variant="success"
                                onClick={exportToExcel}
                                disabled={attendees.length === 0}
                                className={styles.exportButton}
                            >
                                <i className="bi bi-download me-2"></i>
                                Exportar a Excel
                            </Button>
                        </div>

                        {attendees.length > 0 ? (
                            <div className={styles.tableContainer}>
                                <Table striped bordered hover responsive className={styles.attendeesTable}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                            <th>Fecha de Inscripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.map((attendee, index) => (
                                            <tr key={attendee.id}>
                                                <td>{index + 1}</td>
                                                <td className={styles.nameCell}>
                                                    <i className="bi bi-person-fill me-2"></i>
                                                    {attendee.name}
                                                </td>
                                                <td className={styles.emailCell}>
                                                    <i className="bi bi-envelope-fill me-2"></i>
                                                    <a href={`mailto:${attendee.email}`} className={styles.emailLink}>
                                                        {attendee.email}
                                                    </a>
                                                </td>
                                                <td className={styles.phoneCell}>
                                                    <i className="bi bi-telephone-fill me-2"></i>
                                                    {(attendee as any).phone || 'No disponible'}
                                                </td>
                                                <td className={styles.dateCell}>
                                                    <i className="bi bi-calendar-event me-2"></i>
                                                    {formatDate(attendee.registeredAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <i className="bi bi-person-x-fill mb-3"></i>
                                <h5>No hay inscritos aún</h5>
                                <p className="text-muted">
                                    Cuando las personas se inscriban al evento, aparecerán aquí.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button
                    variant="primary"
                    onClick={fetchAttendees}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar Lista
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AttendeesListModal;
