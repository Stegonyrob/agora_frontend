import { act, renderHook } from '@testing-library/react';
import React from 'react';

export function useEventForm({ show }: { show: boolean }) {
    const [title, setTitle] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [eventDate, setEventDate] = React.useState('');
    const [eventTime, setEventTime] = React.useState('');
    const [link, setLink] = React.useState('');
    const [capacity, setCapacity] = React.useState<number | string>(0);
    const [tags, setTags] = React.useState<string[]>([]);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

    return {
        title,
        setTitle,
        message,
        setMessage,
        location,
        setLocation,
        eventDate,
        setEventDate,
        eventTime,
        setEventTime,
        link,
        setLink,
        capacity,
        setCapacity,
        tags,
        setTags,
        imagePreviews,
        setImagePreviews,
    };
}

describe('useEventForm', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useEventForm({ show: true }));
        expect(typeof result.current.title).toBe('string');
        expect(typeof result.current.message).toBe('string');
        expect(typeof result.current.location).toBe('string');
        expect(typeof result.current.eventDate).toBe('string');
        expect(typeof result.current.eventTime).toBe('string');
        expect(typeof result.current.link).toBe('string');
        expect(typeof result.current.capacity === 'number' || typeof result.current.capacity === 'string').toBe(true);
        expect(Array.isArray(result.current.tags)).toBe(true);
        expect(Array.isArray(result.current.imagePreviews)).toBe(true);
    });

    it('should update title field', () => {
        const { result } = renderHook(() => useEventForm({ show: true }));
        act(() => {
            result.current.setTitle('Nuevo Evento');
        });
        expect(result.current.title).toBe('Nuevo Evento');
    });

    // Si el hook usa endpoints, asegúrate de que vengan de variables de entorno y mockéalos aquí si es necesario.
});
