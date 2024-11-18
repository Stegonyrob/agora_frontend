
import React, { useState } from "react";
import styles from '../ButtonIcons.module.scss';



interface ButtonAdjustProfileProps {

    userId: number;

    onAdjust: (userId: number) => Promise<boolean>;

    label: string;
}

const ButtonAdjustProfile: React.FC<ButtonAdjustProfileProps> = ({ userId, onAdjust }) => {
    const [color, setColor] = useState("blue");
    const [label, setLabel] = useState("Editar Perfil");

    const handleProfileEdit = async () => {
        if (userId === null || userId === undefined) {
            console.error("ButtonAjustProfile: El id del usuario es nulo o indefinido");
            return;
        }
        if (onAdjust === null || onAdjust === undefined) {
            console.error("ButtonAjustProfile: La funci n onAdjust es nula o indefinida");
            return;
        }
        try {
            console.log("ButtonAjustProfile: handleProfileEdit llamada");
            const result = await onAdjust(userId);
            if (result) {
                console.log(`Perfil del usuario con ID ${userId} ajustado correctamente`);
            } else {
                console.error(`Error ajustando perfil del usuario con ID ${userId}`);
            }
        } catch (error) {
            console.error(`Error ajustando perfil del usuario: ${error}`);
        }
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons}>
                <i
                    className="bi bi-gear-fill"
                    onClick={() => {
                        handleProfileEdit();
                        if (userId !== null && userId !== undefined) {
                            window.location.href = `/profile/${userId}`;
                        }
                    }}
                    style={{ cursor: "pointer", color }}
                />
            </span>
        </div>
    );
};


export default ButtonAdjustProfile;