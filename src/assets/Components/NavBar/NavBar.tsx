import { logout } from "@/redux/reducers/loginSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LogoNavBar from "../Logo/LogoNavBar";
import styles from "./NavBar.module.scss";

function NavBar() {
  const dispatch = useDispatch();
  const isAdmin = sessionStorage.role === "ROLE_ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({ neuro: false, session: false });

  const currentPath = window.location.pathname;

  const handleLogout = () => {
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    dispatch(logout());
  };

  const toggleDropdown = (name: "neuro" | "session") => {
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <a href="/">
          <LogoNavBar className={styles.logoSmall} />
        </a>
      </div>
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Abrir menú"
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
        <li>
          <a
            href="/"
            onClick={closeMenu}
            className={currentPath === "/" ? styles.active : ""}
          >Inicio</a>
        </li>
        <li>
          <a
            href="/Agora"
            onClick={closeMenu}
            className={currentPath === "/Agora" ? styles.active : ""}
          >Agora</a>
        </li>
        <li>
          <a
            href="/Services"
            onClick={closeMenu}
            className={currentPath === "/Services" ? styles.active : ""}
          >Servicios</a>
        </li>
        <li>
          <a
            href="/Events"
            onClick={closeMenu}
            className={currentPath === "/Events" ? styles.active : ""}
          >Eventos</a>
        </li>
        <li
          className={styles.dropdown}
          onMouseEnter={() => setDropdownOpen(d => ({ ...d, neuro: true }))}
          onMouseLeave={() => setDropdownOpen(d => ({ ...d, neuro: false }))}
        >
          <button
            onClick={() => toggleDropdown("neuro")}
            className={`${styles.dropbtn} ${["/Neurodiversity", "/Tea", "/Tda_Tdh", "/LearningDifficulties", "/DevelopmentConditions", "/Communication"].includes(currentPath) ? styles.active : ""}`}
            aria-haspopup="true"
            aria-expanded={dropdownOpen.neuro}
          >
            Neurodiversidad
          </button>
          <ul className={`${styles.dropdownContent} ${dropdownOpen.neuro ? styles.show : ""}`}>
            <li>
              <a
                href="/Neurodiversity"
                onClick={closeMenu}
                className={currentPath === "/Neurodiversity" ? styles.active : ""}
              >¿Qué es?</a>
            </li>
            <li>
              <a
                href="/Cea"
                onClick={closeMenu}
                className={currentPath === "/Tea" ? styles.active : ""}
              >Cea/Tea</a>
            </li>
            <li>
              <a
                href="/Tda_Tdh"
                onClick={closeMenu}
                className={currentPath === "/Tda_Tdh" ? styles.active : ""}
              >Tda_Tdh</a>
            </li>
            <li>
              <a
                href="/LearningDifficulties"
                onClick={closeMenu}
                className={currentPath === "/LearningDifficulties" ? styles.active : ""}
              >Dificultades del Aprendizaje</a>
            </li>
            <li>
              <a
                href="/DevelopmentConditions"
                onClick={closeMenu}
                className={currentPath === "/DevelopmentConditions" ? styles.active : ""}
              >Condiciones del Desarrollo</a>
            </li>
            <li>
              <a
                href="/Communication"
                onClick={closeMenu}
                className={currentPath === "/Communication" ? styles.active : ""}
              >Trastornos de la Comunicación</a>
            </li>
          </ul>
        </li>
        <li>
          <a
            href="/AboutMe"
            onClick={closeMenu}
            className={currentPath === "/AboutMe" ? styles.active : ""}
          >Sobre Mi</a>
        </li>
        <li>
          <a
            href="/Blog"
            onClick={closeMenu}
            className={currentPath === "/Blog" ? styles.active : ""}
          >Blog</a>
        </li>
        <li
          className={styles.dropdown}
          onMouseEnter={() => setDropdownOpen(d => ({ ...d, session: true }))}
          onMouseLeave={() => setDropdownOpen(d => ({ ...d, session: false }))}
        >
          <button
            onClick={() => toggleDropdown("session")}
            className={`${styles.dropbtn} ${["/Login", "/Register"].includes(currentPath) ? styles.active : ""}`}
            aria-haspopup="true"
            aria-expanded={dropdownOpen.session}
          >
            Inicio de Sesión
          </button>
          <ul className={`${styles.dropdownContent} ${dropdownOpen.session ? styles.show : ""}`}>
            <li>
              <a
                href="/Login"
                onClick={closeMenu}
                className={currentPath === "/Login" ? styles.active : ""}
              >Login</a>
            </li>
            <li>
              <a
                href="/Register"
                onClick={closeMenu}
                className={currentPath === "/Register" ? styles.active : ""}
              >Registro</a>
            </li>
            <li>
              <button onClick={() => { handleLogout(); closeMenu(); }}>
                Logout
              </button>
            </li>
          </ul>
        </li>
        {isAdmin && (
          <li>
            <a
              href="/admin"
              className={styles.adminDashboardLink}
              onClick={() => {
                sessionStorage.removeItem("viewAsUser");
                closeMenu();
              }}
            >
              Volver al Dashboard Admin
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;