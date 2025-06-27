import React, { ChangeEvent, useRef, useState } from "react";
import styles from "./AvatarPickerModal.module.scss";

// Lista de avatares predefinidos - Colección Simpática de Ágora
const avatarList = [
    // 🎓 CRIATURAS EDUCATIVAS ADORABLES (10)
    {
        name: "Búho Sabio",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=wise-owl&backgroundColor=fef3c7&hair=short01&eyes=happy&mouth=smile"
    },
    {
        name: "Gato Estudioso",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=smart-cat&backgroundColor=fed7aa&eyes=wink&mouth=cute"
    },
    {
        name: "Panda Lector",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=reading-panda&backgroundColor=e5e7eb&hair=short03&eyes=happy&mouth=smile"
    },
    {
        name: "Alien Científico",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=science-alien&backgroundColor=c7d2fe&eyes=stars&mouth=surprised"
    },
    {
        name: "Robot Amigable",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=friendly-robot&backgroundColor=bfdbfe&hair=short02&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Dragón Gentil",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=gentle-dragon&backgroundColor=fca5a5&eyes=happy&mouth=smile"
    },
    {
        name: "Unicornio Mágico",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=magic-unicorn&backgroundColor=f3e8ff&hair=short04&eyes=happy&mouth=smile"
    },
    {
        name: "Zorro Ingenioso",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=clever-fox&backgroundColor=fed7aa&eyes=wink&mouth=smile"
    },
    {
        name: "Pingüino Artista",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=artist-penguin&backgroundColor=e0f2fe&hair=short01&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Rana Química",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=chemistry-frog&backgroundColor=bbf7d0&eyes=happy&mouth=cute"
    },

    // 👾 MONSTRUITOS SÚPER SIMPÁTICOS (20) 
    {
        name: "Cosmos Verde",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=green-cosmos&backgroundColor=86efac&eyes=happy&mouth=smile"
    },
    {
        name: "Bubble Azul",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=blue-bubble&backgroundColor=93c5fd&hair=short02&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Chispa Rosa",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=pink-spark&backgroundColor=f9a8d4&eyes=wink&mouth=cute"
    },
    {
        name: "Nube Morada",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=purple-cloud&backgroundColor=c4b5fd&hair=short03&eyes=happy&mouth=smile"
    },
    {
        name: "Sol Amarillo",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=yellow-sun&backgroundColor=fde047&eyes=stars&mouth=smile"
    },
    {
        name: "Luna Plateada",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=silver-moon&backgroundColor=e5e7eb&hair=short01&eyes=happy&mouth=smile"
    },
    {
        name: "Estrella Dorada",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=golden-star&backgroundColor=fbbf24&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Océano Turquesa",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=ocean-turquoise&backgroundColor=22d3ee&hair=short04&eyes=happy&mouth=smile"
    },
    {
        name: "Bosque Verde",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=forest-green&backgroundColor=4ade80&eyes=wink&mouth=cute"
    },
    {
        name: "Lava Roja",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=lava-red&backgroundColor=f87171&hair=short02&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Cristal Violeta",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=crystal-violet&backgroundColor=a855f7&eyes=stars&mouth=smile"
    },
    {
        name: "Hielo Celeste",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=ice-cyan&backgroundColor=67e8f9&hair=short03&eyes=happy&mouth=smile"
    },
    {
        name: "Tierra Marrón",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=earth-brown&backgroundColor=a3a3a3&eyes=happy&mouth=cute"
    },
    {
        name: "Rayo Eléctrico",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=electric-bolt&backgroundColor=facc15&hair=short01&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Viento Gris",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=wind-gray&backgroundColor=9ca3af&eyes=wink&mouth=smile"
    },
    {
        name: "Flor Coral",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=flower-coral&backgroundColor=fb7185&hair=short04&eyes=happy&mouth=smile"
    },
    {
        name: "Musgo Verde",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=moss-green&backgroundColor=65a30d&eyes=happy&mouth=bigSmile"
    },
    {
        name: "Perla Blanca",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=pearl-white&backgroundColor=f8fafc&hair=short02&eyes=happy&mouth=smile"
    },
    {
        name: "Ámbar Naranja",
        src: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=amber-orange&backgroundColor=fb923c&eyes=wink&mouth=cute"
    },
    {
        name: "Galaxia Índigo",
        src: "https://api.dicebear.com/7.x/big-smile/svg?seed=galaxy-indigo&backgroundColor=6366f1&hair=short03&eyes=stars&mouth=bigSmile"
    }
];

interface AvatarPickerModalProps {
    currentAvatar?: string;
    onSelect: (src: string) => void;
    onUpload?: (src: string | ArrayBuffer | null) => void;
}

const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
    currentAvatar,
    onSelect,
    onUpload
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentAvatarData, setCurrentAvatarData] = useState(avatarList[0]);
    const [uploadError, setUploadError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNext = () => {
        const nextIndex = activeIndex + 1 >= avatarList.length ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
        setCurrentAvatarData(avatarList[nextIndex]);
        onSelect(avatarList[nextIndex].src);
    };

    const showPrevious = () => {
        const prevIndex = activeIndex - 1 < 0 ? avatarList.length - 1 : activeIndex - 1;
        setActiveIndex(prevIndex);
        setCurrentAvatarData(avatarList[prevIndex]);
        onSelect(avatarList[prevIndex].src);
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const imageType = /^image\//;

        if (!imageType.test(file.type)) {
            setUploadError(true);
            setTimeout(() => setUploadError(false), 1200);
            return;
        }

        setUploadError(false);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setIsLoading(false);
            if (onUpload) {
                onUpload(reader.result);
            }
            onSelect(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.avatarSelector}>
                {/* Flecha izquierda */}
                <button
                    className={`${styles.navArrow} ${styles.avatarNavButton}`}
                    onClick={showPrevious}
                    aria-label="Avatar anterior"
                    type="button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Avatar central */}
                <div className={`${styles.avatarContainer} ${uploadError ? styles['avatarContainer--error'] : ''}`}>
                    <div className={styles.avatar}>
                        <img
                            src={currentAvatar || currentAvatarData.src}
                            alt="Avatar seleccionado"
                            className={`${styles.avatarImg} ${isLoading ? styles['avatarImg--loading'] : ''}`}
                            onLoad={() => setIsLoading(false)}
                            onError={(e) => {
                                e.currentTarget.src = "/images/avatarGeneric.png";
                            }}
                        />
                        {isLoading && <div className={styles.loadingSpinner} />}
                    </div>

                    {/* Indicador del nombre del avatar */}
                    <div className={styles.avatarName}>
                        {currentAvatarData.name}
                    </div>
                </div>

                {/* Flecha derecha */}
                <button
                    className={`${styles.navArrow} ${styles.avatarNavButton}`}
                    onClick={showNext}
                    aria-label="Siguiente avatar"
                    type="button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                </button>
            </div>

            {/* Botón de upload elegante */}
            <button
                className={`${styles.uploadButton} ${styles.avatarUploadButton}`}
                onClick={handleUploadClick}
                aria-label="Subir imagen personalizada"
                type="button"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={styles.uploadIcon}>
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    <path d="M12,12L16,16H13V19H11V16H8L12,12Z" />
                </svg>
                <span>Sube tu imagen aquí</span>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.hiddenInput}
            />
        </div>
    );
};

export default AvatarPickerModal;