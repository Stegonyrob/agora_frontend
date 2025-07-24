import { render, screen } from '@testing-library/react';
import AdminDashboardMenu from '../../assets/Components/Blog/admin/dashboard/AdminDashboardMenu';

describe('AdminDashboardMenu', () => {
    it('renders admin and user sections', () => {
        render(<AdminDashboardMenu />);
        expect(screen.getByText(/Vistas Admin/i)).toBeInTheDocument();
        expect(screen.getByText(/Vistas Usuario/i)).toBeInTheDocument();
    });
});
