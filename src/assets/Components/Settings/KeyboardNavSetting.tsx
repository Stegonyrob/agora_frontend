
import styles from "./Settings.module.scss";
type KeyboardNavSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const KeyboardNavSetting = ({ value, onChange }: KeyboardNavSettingProps) => (


    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Navegación por teclado:</label>
        <input
            type="checkbox"
            checked={value}
            onChange={e => onChange(e.target.checked)}
        />
    </div>
);

export default KeyboardNavSetting;