import ImageService from "@/core/images/ImageService";
import { addImages, removeImage } from "@/core/images/imageStore";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ImageUpload.module.css";

const ImageUploadInline = () => {
    const dispatch = useDispatch();
    const imagesState = useSelector((state: any) => state.images);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            try {
                const formData = new FormData();
                Array.from(event.target.files).forEach(file => formData.append("images", file));

                console.log("📤 Subiendo imágenes...", Array.from(event.target.files).map(f => f.name));

                const imageService = new ImageService();
                const uploadedImages = await imageService.uploadImages(formData);

                console.log("✅ Imágenes subidas exitosamente:", uploadedImages);
                dispatch(addImages(uploadedImages));

                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch (error) {
                console.error("❌ Error al subir imágenes:", error);
                alert("Error al subir las imágenes. Por favor, inténtelo de nuevo.");
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = (imageName: string) => {
        dispatch(removeImage(imageName));
        // Opcional: imageService.deleteImage(imageName);
    };

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="form-control"
                    id="imageUpload"
                />
                <label htmlFor="imageUpload" className="btn btn-primary ms-2">
                    📸 Subir Imágenes
                </label>
            </div>
            <small className="text-muted">
                Puedes seleccionar múltiples imágenes. Formatos permitidos: JPG, PNG, GIF
            </small>
            <div className={styles.imagePreviewContainer}>
                {imagesState.images.map((img: any, idx: number) => (
                    <div key={idx} className={styles.imagePreview}>
                        <img src={img.url} alt={img.imageName} width={80} />
                        <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveImage(img.imageName)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploadInline;