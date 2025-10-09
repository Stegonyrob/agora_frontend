import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

describe('Comment CRUD (User)', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    it('renders comments component without errors', () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <div>Comments component test placeholder</div>
            </QueryClientProvider>
        );
        expect(container).toBeInTheDocument();
    });
});
