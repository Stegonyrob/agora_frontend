import React, { ChangeEvent, useState } from "react";

const legoAvatars = [
    "/avatars/lego/lego1.png",
    "/avatars/lego/lego2.png",
    "/avatars/lego/lego3.png",
    // ...más rutas
];

interface AvatarPickerModalProps {
    onSelect: (src: string) => void;
    onUpload: (src: string | ArrayBuffer | null) => void;
}

const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({ onSelect, onUpload }) => {
    const [selectedAvatar, setSelectedAvatar] = useState<string>("");

    const handleSelect = (src: string) => {
        setSelectedAvatar(src);
        onSelect(src);
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2>Elige tu avatar</h2>
            <div style={{ display: "flex", gap: 10 }}>
                {legoAvatars.map((src) => (
                    <img
                        key={src}
                        src={src}
                        alt="avatar"
                        style={{
                            width: 60,
                            cursor: "pointer",
                            border: selectedAvatar === src ? "2px solid #007bff" : "none",
                            borderRadius: "50%",
                        }}
                        onClick={() => handleSelect(src)}
                    />
                ))}
            </div>
            <hr />
            <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
    );
};

export default AvatarPickerModal;