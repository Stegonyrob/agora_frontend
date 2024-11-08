import React from 'react';
import styles from './RadioStatus.module.scss';

interface RadioStatusProps {
    isArchived: boolean;
    onChange: (archived: boolean) => void;
}

const RadioStatus: React.FC<RadioStatusProps> = ({ isArchived, onChange }) => {
    return (
        <div className={styles.customRadios}>
            <div>
                <input
                    type="radio"
                    id="color-1"
                    name="status"
                    value="published"
                    checked={!isArchived}
                    onChange={() => onChange(false)}
                />
                <label htmlFor="color-1">
                    <span>
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
                    </span>
                </label>
            </div>

            <div>
                <input
                    type="radio"
                    id="color-2"
                    name="status"
                    value="archived"
                    checked={isArchived}
                    onChange={() => onChange(true)}
                />
                <label htmlFor="color-2">
                    <span>
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
                    </span>
                </label>
            </div>
        </div>
    );
};

export default RadioStatus;
