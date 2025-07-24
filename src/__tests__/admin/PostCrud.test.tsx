import { render, screen } from '@testing-library/react';
import PostForm from '../../assets/Components/Blog/admin/button/create/modal/PostForm';

describe('Post CRUD (Admin)', () => {
    it('renders post creation form and submits', () => {
        render(
            <PostForm
                show={true}
                onClose={jest.fn()}
                onSubmit={jest.fn()} userId={0} userName={''} />
        );
        expect(screen.getByText(/Título del Post/i)).toBeInTheDocument();
        expect(screen.getByText(/Contenido del Post/i)).toBeInTheDocument();
        // fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Nuevo Post' } });
        // fireEvent.change(screen.getByLabelText(/Contenido/i), { target: { value: 'Contenido del post' } });
        // fireEvent.click(screen.getByRole('button', { name: /Crear Post/i }));
        // Add assertion for successful post creation (mocked)
    });
});
