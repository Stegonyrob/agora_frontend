import { render, screen } from '@testing-library/react';
import NavigationMenu from '../../assets/Components/Blog/admin/dashboard/NavigationMenu';

describe('NavigationMenu (Admin)', () => {
    it('renders admin and user menu grids', () => {
        render(<NavigationMenu items={[]} />);
        expect(screen.getByText(/Vistas Admin/i)).toBeInTheDocument();
        expect(screen.getByText(/Vistas Usuario/i)).toBeInTheDocument();
    });
});
