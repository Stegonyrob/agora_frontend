import { renderHook } from '@testing-library/react';
import { useTagsUpload } from '../../hooks/useTagsUpload';

describe('useTagsUpload', () => {
    it('should provide uploadTagsToEvent function', () => {
        const { result } = renderHook(() => useTagsUpload());
        expect(typeof result.current.uploadTagsToEvent).toBe('function');
    });

    // Puedes agregar más tests para simular el uso de uploadTagsToEvent con mocks si es necesario.
});
