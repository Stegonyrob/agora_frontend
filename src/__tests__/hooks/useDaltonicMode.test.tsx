import { act, renderHook } from '@testing-library/react';
import { useDaltonicMode } from '../../hooks/useDaltonicMode';

describe('useDaltonicMode', () => {
    it('should return a boolean and a setter', () => {
        const { result } = renderHook(() => useDaltonicMode());
        expect(typeof result.current.isDaltonicMode).toBe('boolean');
        expect(typeof result.current.setIsDaltonicMode).toBe('function');
    });

    it('should toggle daltonic mode', () => {
        const { result } = renderHook(() => useDaltonicMode());
        act(() => {
            result.current.setIsDaltonicMode(true);
        });
        expect(result.current.isDaltonicMode).toBe(true);
    });
});
