import { act, renderHook } from '@testing-library/react';
import { useRulesAcceptance } from '../../hooks/useRulesAcceptance';

describe('useRulesAcceptance', () => {
    it('should initialize with rulesAccepted as false', () => {
        const { result } = renderHook(() => useRulesAcceptance());
        expect(result.current.rulesAccepted).toBe(false);
    });

    it('should toggle rulesAccepted to true', () => {
        const { result } = renderHook(() => useRulesAcceptance());
        act(() => {
            result.current.toggleAcceptance();
        });
        expect(result.current.rulesAccepted).toBe(true);
    });
});
