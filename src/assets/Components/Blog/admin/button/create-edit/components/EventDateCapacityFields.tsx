import { format } from 'date-fns'; // 👈 Necesario para mostrar la fecha formateada en el input
import React, { useRef, useState } from 'react'; // 👈 Importar useState y useRef
import { Form } from 'react-bootstrap'; // 👈 Usaremos InputGroup
import 'react-day-picker/dist/style.css';
import styles from '../ModalForm.module.scss';
import DatePickerInput from './DatePickerInput';
import TimePicker from './TimePicker';

interface EventDateCapacityFieldsProps {
    eventDate: string;
    setEventDate: (value: string) => void;
    capacity: number;
    setCapacity: (value: number) => void;
    time: string;
    setTime: (value: string) => void;
}
// Helper para convertir Date a string 'YYYY-MM-DD'
const dateToString = (date: Date): string => format(date, 'yyyy-MM-dd');

// Helper para convertir string 'YYYY-MM-DD' a Date (para DayPicker)
const stringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;

    // Intenta parsear la fecha, si no es válida, devuelve undefined
    const parsedDate = new Date(dateString + 'T00:00:00'); // Añadimos T00:00:00 para forzar UTC
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const EventDateCapacityFields: React.FC<EventDateCapacityFieldsProps> = ({
    eventDate,
    setEventDate,
    capacity,
    setCapacity,
    time,
    setTime
}) => {
    // 1. Estado para controlar la visibilidad del DayPicker
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // 2. Referencia para el contenedor, para cerrar el picker al hacer clic fuera
    const containerRef = useRef<HTMLDivElement>(null);

    // Convertimos el string de la prop a Date para el DayPicker
    const selectedDate = stringToDate(eventDate);

    // Maneja la selección de fecha en el DayPicker
    const handleDaySelect = (date: Date | undefined) => {
        if (date) {
            setEventDate(dateToString(date)); // Guarda la fecha en formato string
            setIsPickerOpen(false); // Cierra el DayPicker después de seleccionar
        }
    };

    // Usa useEffect para manejar el cierre al hacer clic fuera
    React.useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Si el clic no está dentro del contenedor del picker, lo cerramos
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [containerRef]);

    return (
        <div className={`${styles.formGroup} row`}>
            <DatePickerInput eventDate={eventDate} setEventDate={setEventDate} />
            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Hora del Evento *
                </Form.Label>
                <TimePicker value={time} setTime={setTime} />
            </div>
            {/* ... (Aforo) ... */}
            <Form.Group className="col-md-6" controlId="formEventCapacity">
                <Form.Label>
                    <strong>Aforo máximo 👥</strong>
                </Form.Label>
                <Form.Control
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min="0"
                    placeholder="Ej: 25, 50, 100..."
                />
                <Form.Text className={styles.helpText}>
                    💡 Dejar en 0 = sin límite de aforo
                </Form.Text>
            </Form.Group>
        </div>
    );
};

export default EventDateCapacityFields;