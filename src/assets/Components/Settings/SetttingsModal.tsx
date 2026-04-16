import { ISettings } from "@/core/settings/ISettings";
import { SettingsService } from "@/core/settings/SettingsService";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import AnimationSetting from "./AnimationSetting";
import ColorBlindSetting from "./ColorBlindSetting";
import ContrastSetting from "./ConstrastSetting";
import FontSizeSetting from "./FontSizeSetting";
import styles from "./Settings.module.scss";
import TextToSpeechSetting from "./TextToSpeechSetting";

interface UserSettings {
    fontSize: string;
    highContrast: boolean;
    animations: boolean;
    colorBlind: boolean;
    showPersonalInfo: boolean;
    twoFA: boolean;
    socialLinks: string[];
    userId: number;
}

interface SettingsModalProps {
    show: boolean;
    onClose: () => void;
    userId: number;
}

// Conversion functions between frontend (string) and backend (number)
const fontSizeToNumber = (fontSize: string): number => {
    switch (fontSize) {
        case "small": return 16;   // 1rem = 16px
        case "medium": return 20;  // 1.25rem = 20px  
        case "large": return 24;   // 1.5rem = 24px
        default: return 16;
    }
};

const numberToFontSize = (fontSize: number): string => {
    if (fontSize <= 16) return "small";
    if (fontSize <= 20) return "medium";
    return "large";
};

// Default settings object
const defaultSettings: UserSettings = {
    fontSize: "small",
    highContrast: false,
    animations: true,
    colorBlind: false,
    showPersonalInfo: true,
    twoFA: false,
    socialLinks: [],
    userId: 0,
};

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, userId }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const settingsService = new SettingsService();

    const isLogged = !!userId && userId !== 0;

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isLogged) {
                // Convert to backend format
                const backendSettings: ISettings = {
                    ...settings,
                    fontSize: fontSizeToNumber(settings.fontSize)
                };
                await settingsService.saveSettings(userId, backendSettings);
                // Also save to localStorage for immediate effect and trigger event
                localStorage.setItem("settings", JSON.stringify(settings));
                globalThis.dispatchEvent(new Event('settingsUpdated'));
            } else {
                localStorage.setItem("settings", JSON.stringify(settings));
                // Dispatch custom event to notify other components
                globalThis.dispatchEvent(new Event('settingsUpdated'));
            }
            onClose();
        } catch (e) {
            // Maneja el error
            console.error("Error saving settings:", e);
        }
        setSaving(false);
    };

    // Al abrir el modal, carga settings del backend o de localStorage
    useEffect(() => {
        if (show) {
            setLoading(true);
            if (isLogged) {
                settingsService.getSettings(userId)
                    .then(data => {
                        // Convert from backend format
                        const frontendSettings: UserSettings = {
                            ...defaultSettings,
                            ...data,
                            fontSize: numberToFontSize(data.fontSize || 16)
                        };
                        setSettings(frontendSettings);
                    })
                    .catch(() => setSettings(defaultSettings))
                    .finally(() => setLoading(false));
            } else {
                const local = localStorage.getItem("settings");
                setSettings(local ? { ...defaultSettings, ...JSON.parse(local) } : defaultSettings);
                setLoading(false);
            }
        }
    }, [show, userId]);

    // Handler para actualizar settings locales
    const handleUpdate = (updated: Partial<typeof settings>) => {
        setSettings((prev: UserSettings) => ({ ...prev, ...updated }));
    };

    // Handler para eliminar settings en el backend
    const handleDelete = async () => {
        setSaving(true);
        try {
            if (isLogged) {
                await settingsService.deleteSettings(userId);
            }
            localStorage.removeItem("settings");
            onClose();
        } catch (e) {
            // Log the error so it's handled and visible during development/production
            console.error("Error deleting settings:", e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null; // O un spinner

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Configuración</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.settingsModalBody}>
                <FontSizeSetting
                    value={settings.fontSize}
                    onChange={v => handleUpdate({ fontSize: v })}
                />
                <ContrastSetting
                    value={settings.highContrast}
                    onChange={v => handleUpdate({ highContrast: v })}
                />
                <AnimationSetting
                    value={settings.animations}
                    onChange={v => handleUpdate({ animations: v })}
                />
                <ColorBlindSetting
                    value={settings.colorBlind}
                    onChange={v => handleUpdate({ colorBlind: v })}
                />
                <TextToSpeechSetting />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        className={`${styles.settingsButton} ${styles.settingsButtonSuccess}`}
                        onClick={handleSave}
                        disabled={saving}
                        style={{ flex: 1 }}
                    >
                        {saving ? "⏳ Guardando..." : "💾 Guardar"}
                    </button>
                    <button
                        className={`${styles.settingsButton} ${styles.settingsButtonDanger}`}
                        onClick={handleDelete}
                        disabled={saving}
                        style={{ flex: 1 }}
                    >
                        {saving ? "⏳ Borrando..." : "🗑️ Borrar"}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SettingsModal;