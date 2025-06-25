
import styles from "./Settings.module.scss";
type DaltonicSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const DaltonicSetting = ({ value, onChange }: DaltonicSettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Modo daltónico:</label>
        <input
            type="checkbox"
            checked={value}
            onChange={e => onChange(e.target.checked)}
        />
    </div>
);

export default DaltonicSetting;