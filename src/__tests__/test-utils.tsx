import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            session: (state = { isLoggedIn: false, user: null }, action) => state,
            posts: (state = { posts: [], loading: false }, action) => state,
            events: (state = { events: [], loading: false }, action) => state,
            profiles: (state = { profiles: [], loading: false }, action) => state,
            profile: (state = { profiles: [], loading: false }, action) => state,
            avatars: (state = { avatars: [], loading: false }, action) => state,
        },
        preloadedState: initialState,
    });
};

// Mock implementations for common hooks and services
export const mockNavigate = vi.fn();
export const mockDispatch = vi.fn();
export const mockUseSelector = vi.fn();

// All providers wrapper for testing
interface AllProvidersProps {
    children: React.ReactNode;
    initialEntries?: string[];
    store?: any;
}

const AllProviders: React.FC<AllProvidersProps> = ({
    children,
    initialEntries = ['/'],
    store: customStore
}) => {
    const testStore = customStore || createMockStore();

    return (
        <Provider store={testStore}>
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        </Provider>
    );
};

// Custom render function that includes all providers
const customRender = (
    ui: React.ReactElement,
    options: RenderOptions & {
        initialEntries?: string[];
        store?: any;
    } = {}
) => {
    const { initialEntries, store, ...renderOptions } = options;

    return render(ui, {
        wrapper: (props) => (
            <AllProviders
                {...props}
                initialEntries={initialEntries}
                store={store}
            />
        ),
        ...renderOptions,
    });
};

// Mock API responses
export const mockApiResponses = {
    loginSuccess: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 1,
        user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
        }
    },

    loginError: {
        error: 'Invalid credentials'
    },

    registerSuccess: {
        message: 'User registered successfully',
        userId: 1
    },

    postsResponse: {
        posts: [
            { id: 1, title: 'Test Post', content: 'Test content' },
            { id: 2, title: 'Another Post', content: 'More content' }
        ]
    },

    eventsResponse: {
        events: [
            { id: 1, title: 'Test Event', date: '2025-01-01' },
            { id: 2, title: 'Another Event', date: '2025-01-02' }
        ]
    }
};

// Mock fetch for API calls
export const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper function to mock successful API responses
export const mockApiSuccess = (response: any) => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => response,
    });
};

// Helper function to mock API errors
export const mockApiError = (error: any, status = 400) => {
    mockFetch.mockRejectedValueOnce({
        ok: false,
        status,
        json: async () => error,
    });
};

// Helper to reset all mocks
export const resetAllMocks = () => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    mockUseSelector.mockClear();
    mockFetch.mockClear();
};

// Export everything needed for tests
export * from '@testing-library/react';
export {
    AllProviders,
    createMockStore,
    customRender as render,
    customRender as renderWithProviders,
    vi
};

