import React, { Key } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavigationMenu.module.scss';
import { iconMap } from './iconMap';

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
    const adminItems = items.filter(item => item.role === "ROLE_ADMIN" && !item.viewAsUser);
    const userItems = items.filter(item => item.viewAsUser);
    const navigate = useNavigate();

    const handleClick = (item: NavMenuItem) => {
        if (item.viewAsUser) {
            sessionStorage.setItem("viewAsUser", "true");
        } else {
            sessionStorage.setItem("viewAsUser", "false");
        }
        if (onNavigate) {
            onNavigate(item.path);
        } else {
            navigate(item.path);
        }
    };

    const renderGrid = (items: NavMenuItem[], title: string, badgeClass: string) => (
        <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.menuGrid}>
                {items.map((item) => {
                    const Icon = iconMap[item.key as string];
                    return (
                        <div
                            key={item.key}
                            className={styles.menuItem}
                            style={{ backgroundImage: `url(${item.background})` }}
                            onClick={() => handleClick(item)}
                        >
                            {typeof Icon === 'function' ? (
                                <span className={styles.menuIcon}><Icon width={44} height={22} /></span>
                            ) : (
                                <i className={`bi ${Icon || 'bi-grid'} ${styles.menuIcon}`}></i>
                            )}
                            <div className={styles.label}>{item.label}</div>
                            {badgeClass && (
                                <span className={styles[badgeClass]}>{badgeClass === 'adminBadge' ? 'Admin' : 'Usuario'}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={styles.dashboardWrap}>
            {adminItems.length > 0 && renderGrid(adminItems, "Vistas Admin", "adminBadge")}
            {userItems.length > 0 && renderGrid(userItems, "Vistas Usuario", "userBadge")}
        </div>
    );
};

export default NavigationMenu;