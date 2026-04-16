import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import textsReducer from '../../core/texts/textStore';
import { useTexts } from '../../hooks/useTexts';

describe('useTexts', () => {

    it('should return an array of texts', () => {
        const preloadedState = {
            texts: {
                texts: [
                    { id: 1, title: 'Test', content: 'Contenido', category: 'general', message: '', images: [], name_image: '' },
                    { id: 2, title: 'Otro', content: 'Más', category: 'general', message: '', images: [], name_image: '' }
                ],
                isLoaded: true,
            }
        };
        const store = configureStore({
            reducer: { texts: textsReducer },
            preloadedState,
        });
        const { result } = renderHook(() => useTexts(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });
        expect(Array.isArray(result.current)).toBe(true);
        expect(result.current.length).toBe(2);
        expect(result.current[0].title).toBe('Test');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
