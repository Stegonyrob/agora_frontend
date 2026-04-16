import { renderHook } from '@testing-library/react';
import { useTagsUploadPost } from '../../hooks/useTagsUploadPost';

describe('useTagsUploadPost', () => {
    it('should provide uploadTagsToPost function', () => {
        const { result } = renderHook(() => useTagsUploadPost());
        expect(typeof result.current.uploadTagsToPost).toBe('function');
    });

    // Puedes agregar más tests para simular el uso de uploadTagsToPost con mocks si es necesario.
});
