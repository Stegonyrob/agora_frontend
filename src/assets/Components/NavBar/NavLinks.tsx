import React from 'react';
import { NavLink } from 'react-router-dom';
import navBarStyles from './NavBar.module.scss';
import NavDropdown from './NavDropdown';

interface NavLinksProps {
    closeMenu: () => void;
    isLoggedIn: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ closeMenu, isLoggedIn }) => {
    // Función para clases de enlaces normales
    const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${navBarStyles.navLinks} ${navBarStyles.active}` : navBarStyles.navLinks;

    // Función para clases de enlaces dentro de un dropdown
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
                    <NavLink to="/agora" className={getDropdownLinkClassName} onClick={closeMenu}>Ágora</NavLink>
                    <NavLink to="/services" className={getDropdownLinkClassName} onClick={closeMenu}>Nuestros Servicios</NavLink>
                    <NavLink to="/aboutme" className={getDropdownLinkClassName} onClick={closeMenu}>Sobre Mí</NavLink>
                </NavDropdown>
            </li>
            <li className={navBarStyles.navItem}>
                <NavLink to="/events" className={getLinkClassName} onClick={closeMenu}>
                    Eventos
                </NavLink>
            </li>
            <li className={navBarStyles.navItem}>
                <NavDropdown title="Neurodiversidad">
                    <NavLink to="/neurodiversity" className={getDropdownLinkClassName} onClick={closeMenu}>¿Qué es?</NavLink>
                    <NavLink to="/cea" className={getDropdownLinkClassName} onClick={closeMenu}>Cea/Tea</NavLink>
                    <NavLink to="/tda_tdh" className={getDropdownLinkClassName} onClick={closeMenu}>Tda_Tdh</NavLink>
                    <NavLink to="/learningdifficulties" className={getDropdownLinkClassName} onClick={closeMenu}>Dificultades del Aprendizaje</NavLink>
                    <NavLink to="/developmentconditions" className={getDropdownLinkClassName} onClick={closeMenu}>Condiciones del Desarrollo</NavLink>
                    <NavLink to="/communication" className={getDropdownLinkClassName} onClick={closeMenu}>Trastornos de la Comunicación</NavLink>
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
