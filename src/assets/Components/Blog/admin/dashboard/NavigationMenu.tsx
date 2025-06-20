import React, { Key } from 'react';
import styles from './NavigationMenu.module.scss';

export interface NavMenuItem {
    key: Key | null | undefined;
    label: string;
    path: string;
    background: string;
    viewAsUser?: boolean;
    role?: string;
}

interface NavigationMenuProps {
    items: NavMenuItem[];
    onNavigate?: (path: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ items, onNavigate }) => {
    const handleClick = (item: NavMenuItem) => {

        if (item.viewAsUser) {
            sessionStorage.setItem("viewAsUser", "true");
        } else {
            sessionStorage.setItem("viewAsUser", "false");
        }
        if (onNavigate) {
            onNavigate(item.path);
        } else {
            window.location.href = item.path;
        }
    };
    return (
        <div className={styles.menuGrid}>
            {items.map((item) => (
                <div
                    key={item.key}
                    className={styles.menuItem}
                    onClick={() => handleClick(item)}
                >
                    <div className={styles.label}>{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export default NavigationMenu;