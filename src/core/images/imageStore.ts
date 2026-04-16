import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IImage } from "./IImage";

interface ImagesState {
  images: IImage[];
  mainImageUrl: string;
}

const initialState: ImagesState = {
  images: [],
  mainImageUrl: "/images/placeholder-image.svg",
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setImages(state, action: PayloadAction<IImage[]>) {
      state.images = action.payload;
      if (action.payload.length > 0) {
        state.mainImageUrl = action.payload[0].url || state.mainImageUrl;
      }
    },
    addImages(state, action: PayloadAction<IImage[]>) {
      state.images.push(...action.payload);
      if (state.images.length > 0) {
        state.mainImageUrl = state.images[0].url || state.mainImageUrl;
      }
    },
    removeImage(state, action: PayloadAction<string>) {
      state.images = state.images.filter(
        (img) => img.imageName !== action.payload
      );
      if (state.images.length > 0) {
        state.mainImageUrl =
          state.images[0].url || "/images/placeholder-image.svg";
      } else {
        state.mainImageUrl = "/images/placeholder-image.svg";
      }
    },
    resetImages(state) {
      state.images = [];
      state.mainImageUrl = "/images/placeholder-image.svg";
    },
  },
});

export const { setImages, addImages, removeImage, resetImages } =
  imagesSlice.actions;
export default imagesSlice.reducer;
