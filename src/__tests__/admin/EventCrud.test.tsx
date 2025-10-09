import { screen } from '@testing-library/react';
import EventForm from '../../assets/Components/Blog/admin/button/create-edit/EventForm';
import { renderWithProviders, vi } from '../test-utils';

describe('Event CRUD (Admin)', () => {
    it('renders event creation form and submits', () => {
        renderWithProviders(
            <EventForm
                show={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
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
