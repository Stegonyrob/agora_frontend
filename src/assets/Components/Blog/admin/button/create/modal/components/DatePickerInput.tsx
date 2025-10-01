import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css'; // ¡Importar estilos base!
import styles from './DatePickerInput.module.scss';
const dateToString = (date: Date): string => format(date, 'yyyy-MM-dd');

const stringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parsedDate = new Date(dateString + 'T00:00:00');
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};


interface DatePickerInputProps {
    eventDate: string;
    setEventDate: (value: string) => void;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ eventDate, setEventDate }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedDate = stringToDate(eventDate);

    // Función de selección
    const handleDaySelect = (date: Date | undefined) => {
        if (date) {
            setEventDate(dateToString(date));
            setIsPickerOpen(false); // Cierra el picker al seleccionar
        }
    };

    // Lógica para cerrar al hacer clic fuera
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    return (
        <div className={`${styles.formGroup} row`}>
            <Form.Group className="col-md-6" controlId="formEventDate">
                <Form.Label>
                    <strong>📅 Fecha del Evento *</strong>
                </Form.Label>
                <div className={styles.inputWrapper}>
                    <Form.Control
                        type="text"
                        value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                        placeholder="dd/mm/aaaa"
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        onClick={() => setIsPickerOpen(true)}
                        className={styles.formControl}
                        style={{ paddingRight: '2.5rem' }} // Espacio para el icono
                    />
                    <span
                        className={styles.icon}
                        onClick={() => setIsPickerOpen(!isPickerOpen)}
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >

                    </span>
                </div>
                {isPickerOpen && (
                    <div className={styles.popup}>
                        <DayPicker
                            ISOWeek
                            animate
                            locale={es}
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDaySelect}
                            captionLayout="label"
                            navLayout="around"
                            required
                            showOutsideDays
                            timeZone="Europe/Madrid"
                            footer={
                                selectedDate
                                    ? `Fecha  ${selectedDate.toLocaleDateString()}.`
                                    : "Por favor, selecciona una fecha."
                            }
                        />
                    </div>
                )}
            </Form.Group>
        </div>
    );
};

export default DatePickerInput;