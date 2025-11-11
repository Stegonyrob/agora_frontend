import { act, renderHook } from '@testing-library/react';
import { useFontSize } from '../../hooks/useFontSize';

describe('useFontSize', () => {

    beforeEach(() => {
        // Mock localStorage
        const localStorageMock = (function () {
            let store: Record<string, string> = {};
            return {
                getItem(key: string) {
                    return store[key] || null;
                },
                setItem(key: string, value: string) {
                    store[key] = value;
                },
                removeItem(key: string) {
                    delete store[key];
                },
                clear() {
                    store = {};
                }
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    it('should return a font size and a setter', () => {
        const { result } = renderHook(() => useFontSize());
        expect(typeof result.current.fontSize).toBe('string');
        expect(['small', 'medium', 'large']).toContain(result.current.fontSize);
        expect(typeof result.current.setFontSize).toBe('function');
    });

    it('should update font size', () => {
        const { result } = renderHook(() => useFontSize());
        act(() => {
            result.current.setFontSize('large');
        });
        expect(result.current.fontSize).toBe('large');
    });
});
