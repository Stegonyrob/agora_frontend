import { act, renderHook } from '@testing-library/react';
import { useTagsLoader } from '../../hooks/useTagsLoader';

describe('useTagsLoader', () => {
    it('should initialize with empty tags', () => {
        const { result } = renderHook(() => useTagsLoader([]));
        expect(Array.isArray(result.current.tags)).toBe(true);
        expect(result.current.tags.length).toBe(0);
    });

    it('should set tags', () => {
        const { result } = renderHook(() => useTagsLoader([]));
        const tags = [
            { id: 1, name: 'tag1', archived: false },
            { id: 2, name: 'tag2', archived: false },
        ];
        act(() => {
            result.current.setTags(tags);
        });
        expect(result.current.tags).toEqual(tags);
    });
});
