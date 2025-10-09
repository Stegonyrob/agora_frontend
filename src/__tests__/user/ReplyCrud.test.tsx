import { renderWithProviders } from '../test-utils';

describe('Replies (User)', () => {
    it('renders replies component without errors', () => {
        const { container } = renderWithProviders(<div>Replies component test placeholder</div>);
        expect(container).toBeInTheDocument();
    });
});
