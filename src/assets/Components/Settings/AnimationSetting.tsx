import styles from "./Settings.module.scss";

type AnimationSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const AnimationSetting = ({ value, onChange }: AnimationSettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            Animaciones
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            <span style={{ marginLeft: 12 }}>
                {value ? "Activadas" : "Desactivadas"}
            </span>
        </label>
    </div>
);

export default AnimationSetting;