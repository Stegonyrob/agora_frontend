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
            <label className={styles.settingsLabel}>
                <span>Lectura de texto</span>
                <span
                    style={{
                        backgroundColor: speaking ? '#28a745' : '#6c757d',
                        color: '#fff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginLeft: 'auto'
                    }}
                >
                    {speaking ? "Activo" : "Inactivo"}
                </span>
            </label>
            <button
                type="button"
                className={styles.settingsButtonSmall}
                onClick={handleSpeak}
                style={{
                    background: speaking
                        ? 'linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)'
                        : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                    boxShadow: speaking
                        ? '0 2px 8px rgba(220, 53, 69, 0.3)'
                        : '0 2px 8px rgba(0, 123, 255, 0.3)'
                }}
            >
                {speaking ? "🛑 Detener" : "🔊 Leer página"}
            </button>
        </div>
    );
};

export default TextToSpeechSetting;