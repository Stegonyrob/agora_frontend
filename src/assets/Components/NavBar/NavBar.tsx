import { logout } from "@/core/auth/sessionStore";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import LogoNavBar from "../Logo/LogoNavBar";
import SettingsModal from "../Settings/SetttingsModal";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import styles from "./NavBar.module.scss";
import NavLinks from "./NavLinks";
import ToggleGrayScaleButton from "./ToggleGrayScaleButton";

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [click, setClick] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [grayScale, setGrayScale] = useState(false);

    const userName = useSelector((state: RootState) => state.session.userName) || sessionStorage.getItem("userName") || "Usuario";
    const avatarUrl = useSelector((state: RootState) => state.session.avatarUrl) || "/images/avatarGeneric.png";
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    const userId = Number(sessionStorage.getItem("userId")) || 0;
    const isLoggedIn = userId > 0;
    const handleClick = () => setClick(!click);
    const closeMenu = () => setClick(false);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        dispatch(logout());
        navigate("/login");
    };

    // Grayscale effect
    useEffect(() => {
        document.body.style.filter = grayScale ? "grayscale(100%)" : "none";
        return () => {
            document.body.style.filter = "none";
        };
    }, [grayScale]);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.logoAndToggle}>
                    <NavLink to="/" className={styles.navLogo} onClick={closeMenu}>
                        <LogoNavBar className={styles.logoSmall} />
                    </NavLink>
                    <span className={styles.specialIcon}>
                        <ToggleGrayScaleButton checked={grayScale} onChange={() => setGrayScale((prev) => !prev)} />
                    </span>
                </div>

                {/* El menú de navegación ahora está separado de los controles */}
                <ul className={click ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>
                    <NavLinks closeMenu={closeMenu} isLoggedIn={isLoggedIn} />
                    {isAdmin && (
                        <li className={styles.navDashboard}>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLinks} ${styles.active}`
                                        : styles.navLinks
                                }
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                    )}
                </ul>

                {/* --- Contenedor para todos los controles de la derecha --- */}
                <div className={styles.rightControls}>
                    {isLoggedIn ? (
                        <div className={styles.avatarNav}>
                            <Avatar
                                userName={userName}
                                avatarUrl={avatarUrl}
                                onProfile={() => navigate("/profile")}
                                onSettings={() => setShowSettingsModal(true)}
                                onLogout={handleLogout}
                            />
                        </div>
                    ) : (
                        <span className={styles.settingsIcon} title="Configuración" onClick={() => setShowSettingsModal(true)}>
                            <i className="bi bi-gear"></i>
                        </span>
                    )}
                    <button className={styles.navIcon} onClick={handleClick} aria-label="Toggle menu">
                        {click ? <HamburgetMenuClose /> : <HamburgetMenuOpen />}
                    </button>
                </div>
            </div>

            {/* Modal de settings, visible para ambos casos */}
            {showSettingsModal && (
                <SettingsModal
                    show={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                    userId={Number(isLoggedIn ? userId : 0)}
                />
            )}
        </nav>
    );
}

export default NavBar;
