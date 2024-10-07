import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from './FooterAdmin.module.scss';
interface InteractionAdminCountProps {
    icon: string;
    alt: string;
    color: string;
}

const InteractionAdminCount: React.FC<InteractionAdminCountProps> = ({ icon, alt, color }) => {
    const [count, setCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
        setCount(isClicked ? count - 1 : count + 1);
    };

    return (
        <span className={styles.icon}>
            <i
                className={`bi bi-heart ${isClicked ? "text-red-500" : ""}`}
                onClick={handleClick}

            ></i>
            <p style={{ color }}>{count}</p>
        </span>
    );
};

InteractionAdminCount.propTypes = {
    icon: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

InteractionAdminCount.defaultProps = {
    color: "#000",
};

export { InteractionAdminCount };
