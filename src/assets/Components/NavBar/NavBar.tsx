import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LogoNavBar from "../Logo/LogoNavBar";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import styles from "./NavBar.module.scss";
import ToggleGrayScaleButton from "./ToggleGrayScaleButton";


function NavBar() {
    const [click, setClick] = useState(false);
    const [openDropdown, setOpenDropdown] = useState("");
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    console.log("isAdmin:", isAdmin);
    const handleClick = () => setClick(!click);
    const closeMenu = () => setClick(false);
    const handleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? "" : name);
    };
    const [grayScale, setGrayScale] = useState(false);

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
                                <NavLink to="/logout" className={({ isActive }) => (isActive ? `${styles.dropdownLink} ${styles.active}` : styles.dropdownLink)} onClick={closeMenu}>Logout</NavLink>
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

            </div>
        </nav>
    );
}

export default NavBar;