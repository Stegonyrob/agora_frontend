
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useEditEventForm } from '../../hooks/useEditEventForm';

const defaultProps = {
    event: undefined,
    show: true,
    onClose: vi.fn(),
};

describe('useEditEventForm', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useEditEventForm(defaultProps));
        expect(typeof result.current.title).toBe('string');
        expect(typeof result.current.message).toBe('string');
        expect(typeof result.current.place).toBe('string');
        expect(typeof result.current.date).toBe('string');
        expect(typeof result.current.time).toBe('string');
        expect(typeof result.current.link).toBe('string');
        expect(typeof result.current.capacity === 'number' || typeof result.current.capacity === 'string').toBe(true);
        expect(Array.isArray(result.current.tags)).toBe(true);
        expect(Array.isArray(result.current.imagePreviews)).toBe(true);
    });

    it('should update title field', () => {
        const { result } = renderHook(() => useEditEventForm(defaultProps));
        act(() => {
            result.current.setTitle('Nuevo Evento');
        });
        expect(result.current.title).toBe('Nuevo Evento');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
