import React from 'react';
import styles from './ButtonAddImage.module.scss';

interface ButtonAddImageProps {
    onImageSelected: (imageSrc: string, imageTitle: string) => void;
}

const ButtonAddImage: React.FC<ButtonAddImageProps> = ({ onImageSelected }) => {
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            Array.from(event.target.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target?.result as string;
                    onImageSelected(src, file.name);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    return (
        <div className={styles.buttonAddImage}>
            <input
                type="file"
                className={styles.buttonAddImage}
                onChange={handleImageChange}
                multiple
                accept="image/*"
            />
        </div>
    );
};

export default ButtonAddImage;