import React from "react";
import CardEvent from "../Components/Events/CardEvents";
const handleSelectEvent = (event: any) => {
    console.log("Selected event:", event);
};

const EventView: React.FC = () => {
    return (
        <div>
            <h1>Events</h1>
            <CardEvent onSelect={handleSelectEvent} />
        </div>
    );
};

export default EventView;