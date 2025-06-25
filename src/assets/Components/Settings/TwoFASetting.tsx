
import styles from "./Settings.module.scss";
type TwoFASettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const TwoFASetting = ({ value, onChange }: TwoFASettingProps) => (

    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Autenticación en dos pasos (2FA):</label>
        <input
            type="checkbox"
            checked={value}
            onChange={e => onChange(e.target.checked)}
            disabled
        />
        <span style={{ marginLeft: 8, color: "#888" }}>Próximamente</span>
    </div>
);

export default TwoFASetting;