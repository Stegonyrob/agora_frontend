import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import EventForm from './EventForm';

describe('EventForm Component', () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();

    const defaultProps = {
        event: undefined,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
        show: true,
        userId: 1,
    };

    it('renders the form with default fields', () => {
        render(<EventForm {...defaultProps} />);

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Capacidad/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha del Evento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Hora del Evento/i)).toBeInTheDocument();
    });

    it('calls onSubmit with correct data when the form is submitted', async () => {
        render(<EventForm {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Evento de Prueba' } });
        fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Este es un evento de prueba.' } });
        fireEvent.change(screen.getByLabelText(/Ubicación/i), { target: { value: 'Ubicación de Prueba' } });
        fireEvent.change(screen.getByLabelText(/Capacidad/i), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText(/Fecha del Evento/i), { target: { value: '2025-08-30' } });
        fireEvent.change(screen.getByLabelText(/Hora del Evento/i), { target: { value: '19:20' } });

        fireEvent.click(screen.getByText(/Guardar/i));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: 'Evento de Prueba',
            message: 'Este es un evento de prueba.',
            location: 'Ubicación de Prueba',
            capacity: 100,
            eventDate: '2025-08-30',
            eventTime: '19:20',
            tags: [],
        });
    });

    it('calls onClose when the close button is clicked', () => {
        render(<EventForm {...defaultProps} />);

        fireEvent.click(screen.getByLabelText(/Close/i));

        expect(mockOnClose).toHaveBeenCalled();
    });
});
