import { act, renderHook } from '@testing-library/react';
import useContactForm from '../../hooks/useContactForm';

describe('useContactForm', () => {
    it('should initialize with empty fields', () => {
        const { result } = renderHook(() => useContactForm());
        expect(result.current.formState).toEqual({ name: '', email: '', message: '' });
    });

    it('should update field values', () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({ target: { name: 'name', value: 'Test User' } } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleChange({ target: { name: 'email', value: 'test@example.com' } } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleChange({ target: { name: 'message', value: 'Hello' } } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.formState).toEqual({ name: 'Test User', email: 'test@example.com', message: 'Hello' });
    });

    it('should reset form values', async () => {
        const { result } = renderHook(() => useContactForm());
        await act(async () => {
            result.current.handleChange({ target: { name: 'name', value: 'Test User' } } as React.ChangeEvent<HTMLInputElement>);
            // Simular reset después de submit
            await result.current.handleSubmit({ preventDefault: () => { } } as any);
        });
        // El formState se resetea tras submit
        expect(result.current.formState).toEqual({ name: '', email: '', message: '' });
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno
    // y mockéalos aquí si es necesario.
});
