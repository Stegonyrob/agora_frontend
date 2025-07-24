import { render, screen } from '@testing-library/react';
import NavBar from '../../assets/Components/NavBar/NavBar';

describe('NavBar (User)', () => {
    it('renders avatar and navigation links', () => {
        render(<NavBar />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
});
