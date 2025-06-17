import { IEvent } from "../../core/events/IEvent"; // Asegúrate de que esta interfaz esté bien definida
import EventList from "../Components/Card/event/EventList";
import styles from "../Views/scss/Views.module.scss";

interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;
}

const EventView: React.FC<EventListProps> = ({ userId, events, onSelect }) => {



    return (
        <div>
            <h1 className={styles.centeredTitle}>Lista de Eventos Disponibles</h1>

            <EventList userId={userId} events={events} onSelect={onSelect} />

        </div>
    );
}


export default EventView;
