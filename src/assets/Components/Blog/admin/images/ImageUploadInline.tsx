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
            const formData = new FormData();
            Array.from(event.target.files).forEach(file => formData.append("images", file));
            const imageService = new ImageService();
            const uploadedImages = await imageService.uploadImages(formData);
            dispatch(addImages(uploadedImages));
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (imageName: string) => {
        dispatch(removeImage(imageName));
        // Opcional: imageService.deleteImage(imageName);
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.mainImageInput}
            />
            <div className={styles.imagePreviewContainer}>
                {imagesState.images.map((img: any, idx: number) => (
                    <div key={idx} className={styles.imagePreview}>
                        <img src={img.url} alt={img.imageName} width={80} />
                        <button type="button" onClick={() => handleRemoveImage(img.imageName)}>
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploadInline;