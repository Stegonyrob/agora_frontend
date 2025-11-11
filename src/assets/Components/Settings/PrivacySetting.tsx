import styles from "./Settings.module.scss";

type PrivacySettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const PrivacySetting = ({ value, onChange }: PrivacySettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            {' '}
            Mostrar mi información personal
        </label>
    </div>
);

export default PrivacySetting;