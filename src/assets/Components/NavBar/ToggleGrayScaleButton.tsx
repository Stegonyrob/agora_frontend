import React from "react";
import { InfinityIcon } from "./Icons";
import styles from "./ToggleGrayScaleButton.module.scss";

const GrayScaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <span style={{ filter: "grayscale(100%)" }}>
        <InfinityIcon {...props} />
    </span>
);

interface Props {
    checked: boolean;
    onChange: () => void;
}

const ToggleGrayScaleButton: React.FC<Props> = ({ checked, onChange }) => (
    <label className={styles.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.slider}>
            <span className={styles.icon}>
                {checked ? <GrayScaleIcon /> : <InfinityIcon />}
            </span>
        </span>
    </label>
);

export default ToggleGrayScaleButton;