import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TextService from '../../core/texts/TextService';
import TextImageService from '../../core/texts/images/TextImageService';
import { useTextsWithImages } from '../../hooks/useTextsWithImages';

describe('useTextsWithImages', () => {
    beforeAll(() => {
        vi.spyOn(TextService.prototype, 'getAllTexts').mockResolvedValue([
            {
                id: 1,
                title: 'Test',
                category: 'general',
                message: 'Mensaje',
                images: [],
                name_image: '',
                archived: false
            }
        ]);
        vi.spyOn(TextImageService.prototype, 'getImagesByTextId').mockResolvedValue([
            {
                id: 10,
                url: 'img.jpg',
                textId: 1,
                imageName: 'img.jpg',
                imagePath: '/img.jpg'
            }
        ]);
    });

    it('should return an array of texts with images', async () => {
        const { result } = renderHook(() => useTextsWithImages());
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(Array.isArray(result.current.texts)).toBe(true);
        expect(result.current.texts.length).toBe(1);
        expect(result.current.texts[0].images.length).toBe(1);
        expect(result.current.texts[0].text.title).toBe('Test');
    });
});
