import React, { useState } from 'react';

interface ButtonAddImageProps {
    onImageSelected: (imageSrc: string, imageTitle: string) => void;
}

const ButtonAddImage: React.FC<ButtonAddImageProps> = ({ onImageSelected }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [imageTitle, setImageTitle] = useState('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);

                onImageSelected(imageSrc, imageTitle);
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    };

    return (
        <div>

            <input type="file" className="file-upload-input" onChange={handleImageChange} />
        </div>
    );
};

export default ButtonAddImage;