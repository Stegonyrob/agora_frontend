import styles from "./Settings.module.scss";
type ContrastSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const ContrastSetting = ({ value, onChange }: ContrastSettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            Contraste alto
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
        </label>
    </div>
);

export default ContrastSetting;