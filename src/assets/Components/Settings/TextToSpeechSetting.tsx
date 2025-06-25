import { useRef, useState } from "react";
import styles from "./Settings.module.scss";

const TextToSpeechSetting = () => {
    const [speaking, setSpeaking] = useState(false);
    const synthRef = useRef(window.speechSynthesis);

    const handleSpeak = () => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
            setSpeaking(false);
            return;
        }
        const text = document.body.innerText;
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.onend = () => setSpeaking(false);
        synthRef.current.speak(utter);
        setSpeaking(true);
    };

    return (
        <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Lectura de texto:</label>
            <button
                type="button"
                className={styles.settingsButton}
                onClick={handleSpeak}
            >
                {speaking ? "Detener lectura" : "Leer toda la página"}
            </button>
        </div>
    );
};

export default TextToSpeechSetting;