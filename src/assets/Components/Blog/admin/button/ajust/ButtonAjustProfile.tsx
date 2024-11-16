
import React, { useState } from "react";
import styles from '../ButtonIcons.module.scss';



interface ButtonAjustProfileProps {

    userId: number;

    onAjust: (userId: number) => Promise<boolean>;

    label: string;
}

const ButtonAjustProfile: React.FC<ButtonAjustProfileProps> = ({ userId, onAjust }) => {
    const [color, setColor] = useState("blue");
    const [label, setLabel] = useState("Editar Perfil");

    const handleProfileEdit = async () => {
        console.log("ButtonAjustProfile: handleProfileEdit called");
        try {
            const result = await onAjust(userId);
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
                    onClick={handleProfileEdit}
                    style={{ cursor: "pointer", color }}
                />

            </span>
        </div>
    );
};


export default ButtonAjustProfile;