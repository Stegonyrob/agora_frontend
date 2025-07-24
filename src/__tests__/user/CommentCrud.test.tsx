import { render, screen } from '@testing-library/react';
import CommentsList from '../../assets/Components/Blog/comments/CommentsList';

describe('Comment CRUD (User)', () => {
    const mockComments: any[] = [];
    const mockProfiles: any[] = [];
    const mockAvatars: any[] = [];
    const mockCurrentUserId = 1;
    const mockIsAdmin = false;
    const mockReplyTo = null;
    const mockSetReplyTo = jest.fn();
    const mockReplyText = '';
    const mockSetReplyText = jest.fn();
    const mockHandleAddReply = jest.fn();
    const mockEditId = null;
    const mockSetEditId = jest.fn();
    const mockEditText = '';
    const mockSetEditText = jest.fn();
    const mockHandleEditComment = jest.fn();
    const mockHandleUpdateComment = jest.fn();
    const mockHandleDeleteComment = jest.fn();
    const mockEditReplyId = null;
    const mockSetEditReplyId = jest.fn();
    const mockEditReplyText = '';
    const mockSetEditReplyText = jest.fn();
    const mockHandleEditReply = jest.fn();
    const mockHandleUpdateReply = jest.fn();
    const mockHandleDeleteReply = jest.fn();
    const mockGetAvatarUrlByUserId = () => '';

    it('renders empty comments list', () => {
        render(
            <CommentsList
                comments={mockComments}
                profiles={mockProfiles}
                avatars={mockAvatars}
                currentUserId={mockCurrentUserId}
                isAdmin={mockIsAdmin}
                replyTo={mockReplyTo}
                setReplyTo={mockSetReplyTo}
                replyText={mockReplyText}
                setReplyText={mockSetReplyText}
                handleAddReply={mockHandleAddReply}
                editId={mockEditId}
                setEditId={mockSetEditId}
                editText={mockEditText}
                setEditText={mockSetEditText}
                handleEditComment={mockHandleEditComment}
                handleUpdateComment={mockHandleUpdateComment}
                handleDeleteComment={mockHandleDeleteComment}
                editReplyId={mockEditReplyId}
                setEditReplyId={mockSetEditReplyId}
                editReplyText={mockEditReplyText}
                setEditReplyText={mockSetEditReplyText}
                handleEditReply={mockHandleEditReply}
                handleUpdateReply={mockHandleUpdateReply}
                handleDeleteReply={mockHandleDeleteReply}
                getAvatarUrlByUserId={mockGetAvatarUrlByUserId}
            />
        );
        expect(screen.getByText(/Sin comentarios aún/i)).toBeInTheDocument();
    });

    it('renders comments and allows edit/delete', () => {
        const comments = [
            { id: 1, userId: 1, userName: 'TestUser', creationDate: Date.now(), message: 'Comentario 1', replies: [] },
        ];
        render(
            <CommentsList
                comments={comments}
                profiles={mockProfiles}
                avatars={mockAvatars}
                currentUserId={mockCurrentUserId}
                isAdmin={mockIsAdmin}
                replyTo={mockReplyTo}
                setReplyTo={mockSetReplyTo}
                replyText={mockReplyText}
                setReplyText={mockSetReplyText}
                handleAddReply={mockHandleAddReply}
                editId={mockEditId}
                setEditId={mockSetEditId}
                editText={mockEditText}
                setEditText={mockSetEditText}
                handleEditComment={mockHandleEditComment}
                handleUpdateComment={mockHandleUpdateComment}
                handleDeleteComment={mockHandleDeleteComment}
                editReplyId={mockEditReplyId}
                setEditReplyId={mockSetEditReplyId}
                editReplyText={mockEditReplyText}
                setEditReplyText={mockSetEditReplyText}
                handleEditReply={mockHandleEditReply}
                handleUpdateReply={mockHandleUpdateReply}
                handleDeleteReply={mockHandleDeleteReply}
                getAvatarUrlByUserId={mockGetAvatarUrlByUserId}
            />
        );
        expect(screen.getByText('Comentario 1')).toBeInTheDocument();
        // Simular edición y borrado si hay botones
        // fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
        // fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }));
    });
});
