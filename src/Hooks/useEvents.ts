import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { useEffect, useState } from "react";
import { useCurrentUser } from "./useCurrentUser";

interface UseEventsOptions {
  page?: number;
  size?: number;
  autoFetch?: boolean;
}

interface UseEventsReturn {
  events: IEvent[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  refetch: () => void;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const { page = 0, size = 6, autoFetch = true } = options;
  const { isLoggedIn } = useCurrentUser();

  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const eventService = new EventService();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      if (isLoggedIn) {
        console.log(
          `[useEvents] Fetching authenticated events - Page: ${page}, Size: ${size}`
        );
        result = await eventService.fetchEventsPaginated(page, size);
      } else {
        console.log(
          `[useEvents] Fetching public events - Page: ${page}, Size: ${size}`
        );
        result = await eventService.fetchPublicEventsPaginated(page, size);
      }

      console.log(`[useEvents] Events fetched successfully:`, result);
      console.log(
        "[useEvents] Verificando contenido de events:",
        result.content
      );
      console.log(
        "eventTime:",
        result.content.map((event) => event.eventTime)
      );

      setEvents(result.content);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setHasNext(result.hasNext);
      setHasPrevious(result.hasPrevious);
    } catch (err: any) {
      console.error(`[useEvents] Error fetching events:`, err);
      setError(err.message || "Error fetching events");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchEvents();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [page, size, isLoggedIn, autoFetch]);

  return {
    events,
    isLoading,
    error,
    totalPages,
    currentPage,
    hasNext,
    hasPrevious,
    refetch,
  };
};

export default useEvents;
