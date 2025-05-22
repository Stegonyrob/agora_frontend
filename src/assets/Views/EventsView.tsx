import { IEvent } from "../../core/events/IEvent"; // Asegúrate de que esta interfaz esté bien definida
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import EventList from "../Components/Card/event/EventList";

interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;
}

const EventView: React.FC<EventListProps> = ({ userId, events, onSelect }) => {
    const userRole = sessionStorage.getItem("role"); // Cambié "userRole" a "role"

    if (userRole === "ROLE_ADMIN") {
        return (
            <div>
                <h1>Lista de Eventos (Admin)</h1>
                <ListAdmin
                    items={events} // Asegúrate de pasar los eventos aquí
                    type={"event"} // Cambié "post" a "event"
                    onSelect={onSelect}
                    onDelete={async (id: number) => {
                        // Implementa la lógica para eliminar
                    }}
                    onEdit={(item: IEvent) => {
                        // Implementa la lógica para editar
                    }}
                    onArchive={async (id: number) => {
                        // Implementa la lógica para archivar
                        return true; // Cambiar según la lógica
                    }}
                    onUnArchive={async (id: number) => {
                        // Implementa la lógica para desarchivar
                        return true; // Cambiar según la lógica
                    }}
                    onSubmit={(item: IEvent) => {
                        // Implementa la lógica para enviar
                    }}
                    onCreate={async (newItem: IEvent) => {
                        // Implementa la lógica para crear un nuevo evento
                    }}
                    userId={userId || 0} // Asegúrate de que userId sea un número
                />
            </div>
        );
    } else {
        return (
            <div>
                <h1>Lista de Eventos (Usuario)</h1>
                <EventList userId={userId} events={events} onSelect={onSelect} />
            </div>
        );
    }
};

export default EventView;
