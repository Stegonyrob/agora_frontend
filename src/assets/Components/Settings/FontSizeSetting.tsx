import styles from "./Settings.module.scss";
type FontSizeSettingProps = {
    value: string;
    onChange: (value: string) => void;
};

const FontSizeSetting = ({ value, onChange }: FontSizeSettingProps) => (


    <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>
            Tamaño de fuente{' '}
            <select
                className={styles.settingsSelect}
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                <option value="small">Pequeña</option>
                <option value="medium">Mediana</option>
                <option value="large">Grande</option>
            </select>
        </label>
    </div>
);

export default FontSizeSetting;