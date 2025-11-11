import { act, renderHook } from '@testing-library/react';
import { useTextForm } from '../../hooks/useTextForm';

describe('useTextForm', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useTextForm({ show: true }));
        expect(typeof result.current.title).toBe('string');
        expect(typeof result.current.message).toBe('string');
    });

    it('should update title field', () => {
        const { result } = renderHook(() => useTextForm({ show: true }));
        act(() => {
            result.current.setTitle('Nuevo Título');
        });
        expect(result.current.title).toBe('Nuevo Título');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
