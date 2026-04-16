import { act, renderHook } from '@testing-library/react';
import { usePostForm } from '../../hooks/usePostForm';

describe('usePostForm', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePostForm({ show: true }));
        expect(typeof result.current.title).toBe('string');
        expect(typeof result.current.message).toBe('string');
        expect(Array.isArray(result.current.tags)).toBe(true);
        expect(Array.isArray(result.current.imagePreviews)).toBe(true);
    });

    it('should update title field', () => {
        const { result } = renderHook(() => usePostForm({ show: true }));
        act(() => {
            result.current.setTitle('Nuevo Post');
        });
        expect(result.current.title).toBe('Nuevo Post');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
