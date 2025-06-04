import { IEvent } from "../../core/events/IEvent"; // Asegúrate de que esta interfaz esté bien definida
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import EventList from "../Components/Card/event/EventList";


interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;
}

const EventView: React.FC<EventListProps> = ({ userId, events, onSelect }) => {
    const userRole = sessionStorage.getItem("role");

    if (userRole === "ROLE_ADMIN") {
        return (
            <div>
                <h1>Bienvenido Administrad@r a la Lista de Eventos</h1>
                <ListAdmin
                    items={events}
                    type={"event"}
                    onSelect={onSelect}
                    userId={userId || 0} // Asegúrate de que userId sea un número
                    onDelete={async (id: number) => { }}
                    onEdit={() => { }}
                    onArchive={async (id: number) => false}
                    onUnArchive={async (id: number) => false}
                    onSubmit={async (event: IEvent) => { }} // Añade la función requerida
                    onCreate={async () => { }} // Añade la función requerida
                />
            </div>
        );
    } else {
        return (
            <div>
                <h1 >Lista de Eventos Disponibles</h1>

                <EventList userId={userId} events={events} onSelect={onSelect} />

            </div>
        );
    }
};

export default EventView;
