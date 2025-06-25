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
import ToggleGrayScaleButton from "./ToggleGrayScaleButton";


function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [click, setClick] = useState(false);
    const [openDropdown, setOpenDropdown] = useState("");
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [grayScale, setGrayScale] = useState(false);

    const userName = useSelector((state: RootState) => state.session.userName) || sessionStorage.getItem("userName") || "Usuario";
    const avatarUrl = useSelector((state: RootState) => state.session.avatarUrl) || "/avatars/lego/lego1.png";
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    const userId = Number(sessionStorage.getItem("userId")) || 0;
    const isLoggedIn = userId > 0;
    const handleClick = () => setClick(!click);
    const closeMenu = () => setClick(false);

    const handleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? "" : name);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
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
                        <ToggleGrayScaleButton
                            checked={grayScale}
                            onChange={() => setGrayScale(prev => !prev)}
                        />
                    </span>
                </div>
                <div className={styles.navIcon} onClick={handleClick}>
                    {click ? (
                        <span className={styles.icon}>
                            <HamburgetMenuClose />
                        </span>
                    ) : (
                        <span className={styles.icon}>
                            <HamburgetMenuOpen />
                        </span>
                    )}
                </div>

                <ul className={click ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks)}
                            onClick={closeMenu}
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {/* Dropdown 1: Nosotros */}
                    <li
                        className={`${styles.navItem} ${styles.dropdown}`}
                        onMouseEnter={() => setOpenDropdown("nosotros")}
                        onMouseLeave={() => setOpenDropdown("")}
                    >
                        <button
                            className={`${styles.navLinks} ${styles.dropbtn}`}
                            onClick={() => handleDropdown("nosotros")}
                            aria-haspopup="true"
                            aria-expanded={openDropdown === "nosotros"}
                            type="button"
                        >
                            Nosotros
                        </button>
                        <ul className={openDropdown === "nosotros" ? `${styles.dropdownContentOne} ${styles.show}` : styles.dropdownContentOne}>
                            <li>
                                <NavLink to="/agora" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Ágora</NavLink>
                            </li>
                            <li>
                                <NavLink to="/services" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Nuestros Servicios</NavLink>
                            </li>
                            <li>
                                <NavLink to="/aboutme" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Sobre Mi</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/events"
                            className={({ isActive }) => (isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks)}
                            onClick={closeMenu}
                        >
                            Eventos
                        </NavLink>
                    </li>
                    {/* Dropdown 2: Neurodiversidad */}
                    <li
                        className={`${styles.navItem} ${styles.dropdown}`}
                        onMouseEnter={() => setOpenDropdown("neuro")}
                        onMouseLeave={() => setOpenDropdown("")}
                    >
                        <button
                            className={`${styles.navLinks} ${styles.dropbtn}`}
                            onClick={() => handleDropdown("neuro")}
                            aria-haspopup="true"
                            aria-expanded={openDropdown === "neuro"}
                            type="button"
                        >
                            Neurodiversidad
                        </button>
                        <ul className={openDropdown === "neuro" ? `${styles.dropdownContentTwo} ${styles.show}` : styles.dropdownContentTwo}>
                            <li>
                                <NavLink
                                    to="/neurodiversity"
                                    className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)}
                                    onClick={closeMenu}
                                >¿Qué es?</NavLink>
                            </li>
                            <li>
                                <NavLink to="/cea" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Cea/Tea</NavLink>
                            </li>
                            <li>
                                <NavLink to="/tda_tdh" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Tda_Tdh</NavLink>
                            </li>
                            <li>
                                <NavLink to="/learningdifficulties" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Dificultades del Aprendizaje</NavLink>
                            </li>
                            <li>
                                <NavLink to="/developmentconditions" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Condiciones del Desarrollo</NavLink>
                            </li>
                            <li>
                                <NavLink to="/communication" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Trastornos de la Comunicación</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) => (isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks)}
                            onClick={closeMenu}
                        >
                            Blog
                        </NavLink>
                    </li>
                    {/* Dropdown 3: Inicio de Sesión */}
                    <li
                        className={`${styles.navItem} ${styles.dropdown}`}
                        onMouseEnter={() => setOpenDropdown("sesion")}
                        onMouseLeave={() => setOpenDropdown("")}
                    >
                        <button
                            className={`${styles.navLinks} ${styles.dropbtn}`}
                            onClick={() => handleDropdown("sesion")}
                            aria-haspopup="true"
                            aria-expanded={openDropdown === "sesion"}
                            type="button"
                        >
                            <i className="bi bi-person" style={{ marginRight: 6 }}></i>
                            Inicio de Sesión
                        </button>
                        <ul className={openDropdown === "sesion" ? `${styles.dropdownContentTree} ${styles.show}` : styles.dropdownContentTree}>
                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Registro</NavLink>
                            </li>
                            <li>
                                <NavLink to="/logout" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={handleLogout}>Logout</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className={styles.navItem}>
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)}

                            >
                                Dashboard
                            </NavLink>



                        )}
                    </li>

                </ul>

                {/* AVATAR DEL USUARIO - fuera del <ul> */}
                {isLoggedIn && (
                    <div className={styles.avatarNav}>
                        <Avatar
                            userName={userName}
                            avatarUrl={avatarUrl}
                            onProfile={() => navigate("/profile")}
                            onSettings={() => setShowSettingsModal(true)}
                            onLogout={handleLogout}
                        />
                        {showSettingsModal && (

                            <SettingsModal
                                show={showSettingsModal}
                                onClose={() => setShowSettingsModal(false)}
                                userId={Number(sessionStorage.getItem("userId"))}
                            />
                        )}


                    </div>
                )}


                {!isLoggedIn && (
                    <span
                        className={styles.settingsIcon}
                        title="Configuración"
                        style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "1rem", color: "azure", marginRight: "1rem" }}
                        onClick={() => setShowSettingsModal(true)}
                    >
                        <i className="bi bi-gear"></i>
                    </span>
                )}

                {/* Modal de settings, visible para ambos casos */}
                {showSettingsModal && (
                    <SettingsModal
                        show={showSettingsModal}
                        onClose={() => setShowSettingsModal(false)}
                        userId={Number(isLoggedIn ? userId : 0)}
                    />
                )}
            </div>
        </nav>
    );
}

export default NavBar;

