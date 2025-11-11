import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EventService from "./EventService";
import { IEvent } from "./IEvent";
import { IEventCreateDTO, IEventUpdateDTO } from "./IEventBackendDTO";

const service = new EventService();

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async () => await service.fetchEvents()
);

export const fetchEventsPaginated = createAsyncThunk(
  "events/fetchEventsPaginated",
  async ({ page = 0, size = 6 }: { page?: number; size?: number }) =>
    await service.fetchEventsPaginated(page, size)
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event: IEventCreateDTO) => await service.createEvent(event)
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, event }: { id: number; event: IEventUpdateDTO }) =>
    await service.updateEvent(id, event)
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: number) => {
    await service.deleteEvent(id);
    return id;
  }
);

export const archiveEvent = createAsyncThunk(
  "events/archiveEvent",
  async (id: number) => {
    await service.archiveEvent(id, true);
    return id;
  }
);

export const unarchiveEvent = createAsyncThunk(
  "events/unarchiveEvent",
  async (id: number) => {
    await service.unarchiveEvent(id, false);
    return id;
  }
);

// State interface
interface EventsState {
  events: IEvent[];
  totalPages: number;
  page: number;
  isLoaded: boolean;
}

// Initial state
const initialState: EventsState = {
  events: [],
  totalPages: 0,
  page: 0,
  isLoaded: false,
};

// Slice
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    resetEvents(state) {
      state.events = [];
      state.totalPages = 0;
      state.page = 0;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoaded = true;
      })
      // fetchEventsPaginated
      .addCase(fetchEventsPaginated.fulfilled, (state, action) => {
        state.events = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.page =
          "currentPage" in action.payload ? action.payload.currentPage : 0;
        state.isLoaded = true;
      })
      // createEvent
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      // updateEvent
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e.id === action.meta.arg.id
        );
        if (index !== -1) {
          // Only update basic fields to avoid type conflicts
          const updated = action.payload as any;
          state.events[index].title = updated.title;
          state.events[index].message = updated.message;
          state.events[index].capacity = updated.capacity;
          state.events[index].isArchived =
            updated.archived ?? updated.isArchived;
        }
      })
      // deleteEvent
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      })
      // archiveEvent
      .addCase(archiveEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload);
        if (index !== -1) {
          state.events[index].isArchived = true;
        }
      })
      // unarchiveEvent
      .addCase(unarchiveEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload);
        if (index !== -1) {
          state.events[index].isArchived = false;
        }
      });
  },
});

export const { resetEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
