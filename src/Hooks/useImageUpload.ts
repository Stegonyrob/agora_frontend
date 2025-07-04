import { useCallback, useEffect, useState } from "react";

export interface ImagePreview {
  url: string;
  isLoading: boolean;
  file?: File;
  isExisting?: boolean;
}

/**
 * Custom hook for managing image uploads and previews
 * Handles file validation, preview generation, and cleanup
 */
export const useImageUpload = (initialImages: string[] = []) => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  // Initialize with existing images
  useEffect(() => {
    if (initialImages.length > 0) {
      const existingImages: ImagePreview[] = initialImages.map((imageUrl) => ({
        url: imageUrl,
        isLoading: false,
        isExisting: true,
      }));
      setImagePreviews(existingImages);
    } else {
      setImagePreviews([]);
    }
  }, [initialImages]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.url && !preview.isExisting && preview.file) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  /**
   * Handles selection of new image files
   * @param files Array of selected files
   */
  const handleImagesSelected = useCallback((files: File[]) => {
    console.log("🖼️ useImageUpload - Imágenes seleccionadas:", {
      cantidad: files.length,
      archivos: files.map((f) => ({
        nombre: f.name,
        tamaño: f.size,
        tipo: f.type,
      })),
    });

    const newPreviews: ImagePreview[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isLoading: false,
      file: file,
      isExisting: false,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  /**
   * Removes an image from the preview list
   * @param index Index of the image to remove
   */
  const handleRemoveImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev[index];

      if (
        imageToRemove?.url &&
        !imageToRemove.isExisting &&
        imageToRemove.file
      ) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prev.filter((_, i) => i !== index);
    });
  }, []);

  /**
   * Gets only the new files (not existing images)
   * @returns Array of File objects for upload
   */
  const getNewImageFiles = useCallback((): File[] => {
    return imagePreviews
      .filter((preview) => !preview.isExisting && preview.file)
      .map((preview) => preview.file!)
      .filter(Boolean);
  }, [imagePreviews]);

  /**
   * Gets existing image URLs (for update operations)
   * @returns Array of existing image URLs
   */
  const getExistingImageUrls = useCallback((): string[] => {
    return imagePreviews
      .filter((preview) => preview.isExisting)
      .map((preview) => preview.url);
  }, [imagePreviews]);

  /**
   * Clears all images
   */
  const clearImages = useCallback(() => {
    imagePreviews.forEach((preview) => {
      if (preview.url && !preview.isExisting && preview.file) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setImagePreviews([]);
  }, [imagePreviews]);

  return {
    imagePreviews,
    handleImagesSelected,
    handleRemoveImage,
    getNewImageFiles,
    getExistingImageUrls,
    clearImages,
  };
};
