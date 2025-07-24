import { render, screen } from '@testing-library/react';
import Replies from '../../assets/Components/Blog/comments/Replies';

describe('Replies (User)', () => {
    const mockReplies = [
        { id: 1, userId: 2, userName: 'TestUser', message: 'Mensaje de prueba', creationDate: '2025-07-24T12:00:00Z' }
    ];
    const mockProps = {
        replies: mockReplies,
        commentId: 10,
        currentUserId: 2,
        isAdmin: false,
        profiles: [],
        avatars: [],
        editReplyId: null,
        editReplyText: '',
        setEditReplyId: jest.fn(),
        setEditReplyText: jest.fn(),
        handleUpdateReply: jest.fn(),
        handleDeleteReply: jest.fn(),
        handleEditReply: jest.fn(),
        getAvatarUrlByUserId: () => '/images/avatarGeneric.png',
    };

    it('renders replies and allows edit/delete for user', () => {
        render(<Replies {...mockProps} />);
        expect(screen.getByText(/Mensaje de prueba/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // edit/delete icons
    });
});
