import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IImage } from "./IImage";
import ImageService from "./ImageService";

const imageService = new ImageService();

interface ImagesState {
  image: File | null;
  images: File[];
  oldMainImageName?: string;
  oldOtherImageNames?: string[];
  mainImageUrl: string;
  oldMainImageUrl: string;
}

const initialState: ImagesState = {
  image: null,
  images: [],
  oldMainImageName: undefined,
  oldOtherImageNames: [],
  mainImageUrl: "/images/placeholder-image.svg",
  oldMainImageUrl: "",
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    handleFileUpload(state, action: PayloadAction<File | null>) {
      state.image = action.payload;
      if (state.image) {
        state.mainImageUrl = URL.createObjectURL(state.image);
      }
    },
    handleFilesUpload(state, action: PayloadAction<File[]>) {
      state.images.push(...action.payload);
    },
    removeMainImage(state) {
      state.mainImageUrl = "/images/placeholder-image.svg";
      state.image = null;
    },
    resetImagesForm(state) {
      Object.assign(state, initialState);
    },
    refillPhotos(state, action: PayloadAction<{ images: IImage[] }>) {
      const uri: string = import.meta.env.VITE_APP_API_IMGS;
      state.oldMainImageName = action.payload.images.find(
        (image) => image.mainImage
      )?.imageName;
      state.oldOtherImageNames = action.payload.images
        .filter((image) => !image.mainImage)
        .map((image) => image.imageName);
      state.oldMainImageUrl = `${uri}/${state.oldMainImageName}`;
      state.mainImageUrl = state.oldMainImageUrl;
    },
    // Estos métodos ahora son funciones de utilidad, no reducers
  },
});

// Funciones de utilidad
export const checkForNewMainImage = (state: ImagesState): boolean => {
  return state.image?.name !== state.oldMainImageName;
};

export const findImagesToDelete = (state: ImagesState): string[] => {
  const newOtherImageNames = state.images.map((image) => image.name);
  const newOtherImagesSet = new Set(newOtherImageNames);
  const difference =
    state.oldOtherImageNames?.filter(
      (image) => !newOtherImagesSet.has(image)
    ) || [];
  if (checkForNewMainImage(state)) {
    difference.push(state.oldMainImageName!);
  }
  return difference;
};

export const findImagesToUpload = (state: ImagesState): File[] => {
  const newOtherImageNames = state.images.map((image) => image.name);
  const oldOtherImageNamesSet = new Set(state.oldOtherImageNames);
  const difference = newOtherImageNames.filter(
    (name) => !oldOtherImageNamesSet.has(name)
  );
  return state.images.filter((image) => difference.includes(image.name));
};

// Función asíncrona para eliminar imágenes
export const deleteOldImages = async (state: ImagesState) => {
  const imagesToDelete = findImagesToDelete(state);
  for (const imageName of imagesToDelete) {
    await imageService.deleteOne(imageName);
  }
};

// Exportación de acciones
export const {
  handleFileUpload,
  handleFilesUpload,
  removeMainImage,
  resetImagesForm,
  refillPhotos,
} = imagesSlice.actions;

// Selector para obtener el estado
export const selectImagesState = (state: { images: ImagesState }) =>
  state.images;

export default imagesSlice.reducer;
