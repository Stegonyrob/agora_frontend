import { ISettings } from "@/core/settings/ISettings";
import { SettingsService } from "@/core/settings/SettingsService";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import AnimationSetting from "./AnimationSetting";
import ContrastSetting from "./ConstrastSetting";
import DaltonicSetting from "./DaltonicSetting";
import FontSizeSetting from "./FontSizeSetting";
import PrivacySetting from "./PrivacySetting";
import styles from "./Settings.module.scss";
import SocialLinkSetting from "./SocialLinkSetting";
import TextToSpeechSetting from "./TextToSpeechSetting";
import TwoFASetting from "./TwoFASetting";

interface UserSettings {
    fontSize: string;
    highContrast: boolean;
    animations: boolean;
    daltonic: boolean;
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
    daltonic: false,
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
                window.dispatchEvent(new Event('settingsUpdated'));
            } else {
                localStorage.setItem("settings", JSON.stringify(settings));
                // Dispatch custom event to notify other components
                window.dispatchEvent(new Event('settingsUpdated'));
            }
            onClose();
        } catch (e) {
            // Maneja el error
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
            // Maneja el error
        }
        setSaving(false);
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
                <DaltonicSetting
                    value={settings.daltonic}
                    onChange={v => handleUpdate({ daltonic: v })}
                />
                <TextToSpeechSetting />
                <PrivacySetting
                    value={settings.showPersonalInfo}
                    onChange={v => handleUpdate({ showPersonalInfo: v })}
                />
                <TwoFASetting
                    value={settings.twoFA}
                    onChange={v => handleUpdate({ twoFA: v })}
                />
                <SocialLinkSetting
                    value={settings.socialLinks}
                    onChange={v => handleUpdate({ socialLinks: v as string[] })}
                />
                <button
                    className={styles.settingsButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                    className={styles.settingsButton}
                    style={{ background: "#d9534f", marginLeft: "1rem" }}
                    onClick={handleDelete}
                    disabled={saving}
                >
                    {saving ? "Borrando..." : "Borrar configuración"}
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default SettingsModal;