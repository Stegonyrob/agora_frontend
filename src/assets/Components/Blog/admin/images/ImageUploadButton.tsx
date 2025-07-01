import React, { useRef } from "react";
import styles from "./ImageUploadButton.module.scss";

interface ImageUploadButtonProps {
    onImagesSelected: (images: File[]) => void;
    multiple?: boolean;
    className?: string;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
    onImagesSelected,
    multiple = true,
    className = ""
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            onImagesSelected(filesArray);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`${styles.imageUploadButton} ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple={multiple}
                style={{ display: 'none' }}
            />
            <button
                type="button"
                className={styles.uploadButton}
                onClick={handleClick}
            >
                <div className={styles.buttonContent}>
                    <i className={styles.icon}>📷</i>
                    <span className={styles.text}>
                        {multiple ? "Seleccionar Imágenes" : "Seleccionar Imagen"}
                    </span>
                    <small className={styles.subtext}>
                        JPG, PNG, GIF hasta 5MB
                    </small>
                </div>
            </button>
        </div>
    );
};

export default ImageUploadButton;
