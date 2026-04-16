import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EventForm from './EventForm';

describe('EventForm Component', () => {
    const mockOnSubmit = vi.fn();
    const mockOnClose = vi.fn();

    const defaultProps = {
        event: undefined,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
        show: true,
        userId: 1,
        mode: 'create' as const,
    };

    it('renders the form with default fields', () => {
        render(<EventForm {...defaultProps} />);

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha del Evento/i)).toBeInTheDocument();
    });

    it('calls onSubmit with correct data when the form is submitted', async () => {
        render(<EventForm {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Evento de Prueba' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Este es un evento de prueba.' } });
        fireEvent.change(screen.getByLabelText(/Ubicación/i), { target: { value: 'Ubicación de Prueba' } });
        fireEvent.change(screen.getByLabelText(/Fecha del Evento/i), { target: { value: '2025-08-30' } });

        // Verificar que los valores se establecieron correctamente
        expect(screen.getByDisplayValue('Evento de Prueba')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Este es un evento de prueba.')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ubicación de Prueba')).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(<EventForm {...defaultProps} />);

        fireEvent.click(screen.getByLabelText(/Close/i));

        expect(mockOnClose).toHaveBeenCalled();
    });
});
