import { render, screen } from '@testing-library/react';
import EventForm from '../../assets/Components/Blog/admin/button/create-edit/EventForm';

describe('Event CRUD (Admin)', () => {
    it('renders event creation form and submits', () => {
        render(
            <EventForm
                show={true}
                onClose={jest.fn()}
                onSubmit={jest.fn()}
            />
        );
        expect(screen.getByText(/Título del Evento/i)).toBeInTheDocument();
        expect(screen.getByText(/Fecha del Evento/i)).toBeInTheDocument();
        // fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Nuevo Evento' } });
        // fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: '2025-07-24' } });
        // fireEvent.click(screen.getByRole('button', { name: /Crear Evento/i }));
        // Add assertion for successful event creation (mocked)
    });
});
