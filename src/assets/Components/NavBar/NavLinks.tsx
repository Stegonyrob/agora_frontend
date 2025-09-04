import React from 'react';
import { NavLink } from 'react-router-dom';
import NavDropdown from './NavDropdown'; // NavDropdown component, which uses NavDropdown.module.scss
import navBarStyles from './NavLinks.module.scss'; // Note: importing NavBar.module.scss for general nav styles

interface NavLinksProps {
    closeMenu: () => void;
    isLoggedIn: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ closeMenu, isLoggedIn }) => {
    // Function for normal link classes (uses navBarStyles as per your original)
    const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${navBarStyles.navLinks} ${navBarStyles.active}` : navBarStyles.navLinks;

    // Function for links inside a dropdown (uses navBarStyles as per your original)
    // Make sure .dropdownLink is defined in NavLinks.module.scss
    const getDropdownLinkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${navBarStyles.dropdownLink} ${navBarStyles.active}` : navBarStyles.dropdownLink;

    return (
        <>
            <li className={navBarStyles.navItem}>
                <NavLink to="/" className={getLinkClassName} onClick={closeMenu}>
                    Inicio
                </NavLink>
            </li>
            <li className={navBarStyles.navItem}>
                <NavDropdown title="Nosotros">
                    <NavLink to="/agora/nosotros" className={getDropdownLinkClassName} onClick={closeMenu}>Ágora</NavLink>
                    <NavLink to="/agora/servicios" className={getDropdownLinkClassName} onClick={closeMenu}>Nuestros Servicios</NavLink>
                    <NavLink to="/agora/equipo" className={getDropdownLinkClassName} onClick={closeMenu}>Equipo Profesional</NavLink>
                </NavDropdown>
            </li>
            <li className={navBarStyles.navItem}>
                <NavLink to="/events" className={getLinkClassName} onClick={closeMenu}>
                    Eventos
                </NavLink>
            </li>
            <li className={navBarStyles.navItem}>
                <NavDropdown title="Neurodiversidad">
                    <NavLink to="/agora/neurodiversidad" className={getDropdownLinkClassName} onClick={closeMenu}>¿Qué es?</NavLink>
                    <NavLink to="/agora/cea" className={getDropdownLinkClassName} onClick={closeMenu}>Cea/Tea</NavLink>
                    <NavLink to="/agora/atencion" className={getDropdownLinkClassName} onClick={closeMenu}>Tda_Tdh</NavLink>
                    <NavLink to="/agora/aprendizaje" className={getDropdownLinkClassName} onClick={closeMenu}>Dificultades del Aprendizaje</NavLink>
                    <NavLink to="/agora/desarrollo" className={getDropdownLinkClassName} onClick={closeMenu}>Condiciones del Desarrollo</NavLink>
                    <NavLink to="/agora/comunicacion" className={getDropdownLinkClassName} onClick={closeMenu}>Trastornos de la Comunicación</NavLink>
                </NavDropdown>
            </li>
            <li className={navBarStyles.navItem}>
                <NavLink to="/blog" className={getLinkClassName} onClick={closeMenu}>
                    Blog
                </NavLink>
            </li>
            {/* Dropdown condicional para Iniciar Sesión */}
            {!isLoggedIn && (
                <li className={navBarStyles.navItem}>
                    <NavDropdown title="Inicio de Sesión">
                        <NavLink to="/login" className={getDropdownLinkClassName} onClick={closeMenu}>Login</NavLink>
                        <NavLink to="/register" className={getDropdownLinkClassName} onClick={closeMenu}>Registro</NavLink>
                        <NavLink to="/logout" className={getDropdownLinkClassName} onClick={closeMenu}>Logout</NavLink>
                    </NavDropdown>
                </li>
            )}
        </>
    );
};

export default NavLinks;