import React, { useEffect, useRef, useState } from "react";
import styles from "./Avatar.module.scss";

interface AvatarProps {
    userName: string;
    avatarUrl: string;
    onProfile: () => void;
    onSettings: () => void;
    onLogout: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ userName, avatarUrl, onProfile, onSettings, onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cierra el menú si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className={styles.avatarContainer} ref={menuRef}>
            <img
                src={avatarUrl}
                alt={userName}
                className={styles.avatarImage}
                onClick={() => setOpen((prev) => !prev)}
                style={{ cursor: "pointer" }}
            />
            {open && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                        <strong>{userName}</strong>
                    </div>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => { setOpen(false); onProfile(); }}
                    >
                        Perfil
                    </button>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => {
                            console.log("Click en Configuración (Avatar)"); // <-- Aquí el log
                            setOpen(false);
                            onSettings();
                        }}
                    >
                        Configuración
                    </button>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => { setOpen(false); onLogout(); }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default Avatar;