import styles from "./Settings.module.scss";

type AnimationSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const AnimationSetting = ({ value, onChange }: AnimationSettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            {' '}
            Animaciones
            <span
                className={styles.statusBadge}
                style={{
                    backgroundColor: value ? '#2ecc71' : '#e74c3c',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginLeft: 'auto'
                }}
            >
                {value ? "Activadas" : "Desactivadas"}
            </span>
        </label>
    </div>
);

export default AnimationSetting;