
import styles from "./Settings.module.scss";
type SocialLinkSettingProps = {
    value?: unknown;
    onChange?: (value: unknown) => void;
};

const SocialLinkSetting: React.FC<SocialLinkSettingProps> = ({ value, onChange }) => (


    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Vinculación de cuentas:</label>
        <div>
            <button type="button" disabled>
                Conectar con Google (Próximamente)
            </button>
            <button type="button" disabled style={{ marginLeft: 8 }}>
                Conectar con Facebook (Próximamente)
            </button>
        </div>
    </div>
);

export default SocialLinkSetting;