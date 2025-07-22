import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './NavDropdown.module.scss';

interface NavDropdownProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    // El breakpoint debe coincidir con el de tu CSS (960px)
    const isMobile = useMediaQuery({ query: '(max-width: 960px)' });

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsOpen(false);
        }
    };

    const handleClick = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div
            className={`${styles.dropdownContainer} ${className || ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button type="button" className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`} onClick={handleClick} aria-haspopup="true" aria-expanded={isOpen}>
                {title}
                {isMobile && <i className={`bi bi-chevron-down ${styles.icon}`}></i>}
            </button>
            <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ''}`}>{children}</div>
        </div>
    );
};

export default NavDropdown;