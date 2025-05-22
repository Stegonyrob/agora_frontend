import { IEvent } from '@/core/events/IEvent';
import React, { useState } from 'react';
import EventList from '../Components/Card/event/EventList';

const EventsView: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    return (
        <div>
            <h2>Eventos</h2>
            <EventList events={events} userId={null} />
        </div>
    );
};

export default EventsView;

