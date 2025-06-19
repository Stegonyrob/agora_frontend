import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AttendeeService } from "./AttendeeService";
import { IAttendee } from "./IAttendee";
import { IAttendeeDTO } from "./IAttendeeDTO";

const service = new AttendeeService();

export const fetchAttendees = createAsyncThunk(
  "attendees/fetchAttendees",
  async (eventId: number) => await service.getAttendees(eventId)
);

export const registerAttendee = createAsyncThunk(
  "attendees/registerAttendee",
  async ({
    eventId,
    sanitizedForm,
    p0 = "",
    attendee,
  }: {
    eventId: number;
    sanitizedForm: { name: string; email: string; phone: string };
    p0?: string;
    attendee: IAttendeeDTO;
  }) => await service.registerAttendee(eventId, sanitizedForm, p0, attendee)
);

export const deleteAttendee = createAsyncThunk(
  "attendees/deleteAttendee",
  async ({ eventId, attendeeId }: { eventId: number; attendeeId: number }) => {
    await service.deleteAttendee(eventId, attendeeId);
    return attendeeId;
  }
);

interface AttendeesState {
  attendees: IAttendee[];
  isLoaded: boolean;
}

const attendeesSlice = createSlice({
  name: "attendees",
  initialState: { attendees: [], isLoaded: false } as AttendeesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.attendees = action.payload;
        state.isLoaded = true;
      })
      .addCase(registerAttendee.fulfilled, (state, action) => {
        state.attendees.push(action.payload);
      })
      .addCase(deleteAttendee.fulfilled, (state, action) => {
        state.attendees = state.attendees.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export default attendeesSlice.reducer;
