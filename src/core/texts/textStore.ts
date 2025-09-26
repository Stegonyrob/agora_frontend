import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITextItem } from "./IText";
import { ITextItemDTO } from "./ITextDTO";
import TextService from "./TextService";

const service = new TextService();

export const fetchTexts = createAsyncThunk(
  "texts/fetchTexts",
  async () => await service.getAllTexts()
);

export const createText = createAsyncThunk(
  "texts/createText",
  async (text: ITextItemDTO) => await service.createText(text)
);

export const updateText = createAsyncThunk(
  "texts/updateText",
  async ({ id, text }: { id: number; text: ITextItemDTO }) =>
    await service.updateText(id, text)
);

export const deleteText = createAsyncThunk(
  "texts/deleteText",
  async (id: number) => {
    await service.deleteText(id);
    return id;
  }
);

interface TextsState {
  texts: ITextItem[];
  isLoaded: boolean;
}

const textsSlice = createSlice({
  name: "texts",
  initialState: { texts: [], isLoaded: false } as TextsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTexts.fulfilled, (state, action) => {
        state.texts = action.payload;
        state.isLoaded = true;
      })
      .addCase(createText.fulfilled, (state, action) => {
        state.texts.push(action.payload);
      })
      .addCase(updateText.fulfilled, (state, action) => {
        const idx = state.texts.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.texts[idx] = action.payload;
      })
      .addCase(deleteText.fulfilled, (state, action) => {
        state.texts = state.texts.filter((t) => t.id !== action.payload);
      });
  },
});

export default textsSlice.reducer;
