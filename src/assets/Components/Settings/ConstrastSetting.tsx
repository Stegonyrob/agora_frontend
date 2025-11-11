import styles from "./Settings.module.scss";

type ContrastSettingProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
};

const ContrastSetting = ({ value, onChange }: ContrastSettingProps) => (
    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            <input
                type="checkbox"
                className={styles.settingsToggle}
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            {' '}
            Contraste alto
            <span
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
                {value ? "Activado" : "Desactivado"}
            </span>
        </label>
    </div>
);

export default ContrastSetting;