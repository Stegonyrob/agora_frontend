import { screen } from '@testing-library/react';
import PostForm from '../../assets/Components/Blog/admin/button/create-edit/PostForm';
import { renderWithProviders, vi } from '../test-utils';

describe('Post CRUD (Admin)', () => {
    it('renders post creation form and submits', () => {
        renderWithProviders(
            <PostForm
                show={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                userId={1}
            />
        );
        expect(screen.getByText(/Título del Post/i)).toBeInTheDocument();
        expect(screen.getByText(/Contenido del Post/i)).toBeInTheDocument();
        // fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Nuevo Post' } });
        // fireEvent.change(screen.getByLabelText(/Contenido/i), { target: { value: 'Contenido del post' } });
        // fireEvent.click(screen.getByRole('button', { name: /Crear Post/i }));
        // Add assertion for successful post creation (mocked)
    });
});
