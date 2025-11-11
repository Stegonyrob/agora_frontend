import { act, renderHook } from '@testing-library/react';
import { useEditPostForm } from '../../hooks/useEditPostForm';

describe('useEditPostForm', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useEditPostForm({ post: undefined, show: true }));
        expect(typeof result.current.title).toBe('string');
        expect(typeof result.current.message).toBe('string');
        expect(Array.isArray(result.current.tags)).toBe(true);
    });

    it('should update title field', () => {
        const { result } = renderHook(() => useEditPostForm({ post: undefined, show: true }));
        act(() => {
            result.current.setTitle('Nuevo Post');
        });
        expect(result.current.title).toBe('Nuevo Post');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
