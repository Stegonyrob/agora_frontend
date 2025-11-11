import { renderHook } from '@testing-library/react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

describe('useGoogleMaps', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => useGoogleMaps({ apiKey: 'test-key' }));
        expect(typeof result.current.isLoaded).toBe('boolean');
        expect(
            result.current.loadError === null || typeof result.current.loadError === 'string'
        ).toBe(true);
    });

    // Si el hook usa endpoints o claves, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
