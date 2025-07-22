import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './NavDropdown.module.scss'; // Import its own styles

interface NavDropdownProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Consistent breakpoint with SCSS $breakpoint-tablet (940px)
    const isMobile = useMediaQuery({ query: '(max-width: 940px)' });

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
        // Toggle only on mobile
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
                {/* Show chevron down only on mobile, consistent with your original code */}
                {isMobile && <i className={`bi bi-chevron-down ${styles.icon}`}></i>}
            </button>
            <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ''}`}>{children}</div>
        </div>
    );
};

export default NavDropdown;