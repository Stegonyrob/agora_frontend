import styles from "./Settings.module.scss";

type TwoFASettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const TwoFASetting = ({ value, onChange }: TwoFASettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            {' '}
            Autenticación en dos pasos (2FA)
        </label>
    </div>
);

export default TwoFASetting;