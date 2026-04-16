import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILegalText } from "./ILegalText";
import { LegalTextService } from "./LegalTextService";

const service = new LegalTextService();

export const fetchLegalTexts = createAsyncThunk(
  "legalTexts/fetchLegalTexts",
  async (type: string) => await service.getLegalTexts(type)
);

interface LegalTextsState {
  legalTexts: ILegalText[];
  isLoaded: boolean;
}

const legalTextsSlice = createSlice({
  name: "legalTexts",
  initialState: { legalTexts: [], isLoaded: false } as LegalTextsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLegalTexts.fulfilled, (state, action) => {
      state.legalTexts = action.payload;
      state.isLoaded = true;
    });
  },
});

export default legalTextsSlice.reducer;
