import styles from "./Settings.module.scss";
type PrivacySettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const PrivacySetting = ({ value, onChange }: PrivacySettingProps) => (


    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Mostrar mi información personal:</label>
        <input
            type="checkbox"
            checked={value}
            onChange={e => onChange(e.target.checked)}
        />
    </div>
);

export default PrivacySetting;