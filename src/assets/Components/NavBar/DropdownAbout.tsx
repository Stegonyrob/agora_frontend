// src/assets/Components/NavBar/Dropdowns/DropdownNosotros.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const DropdownAbout: React.FC = () => {
    return (
        <ul className="dropdown-content-one">
            <li>
                <NavLink to="/agora" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Ágora</NavLink>
            </li>
            <li>
                <NavLink to="/services" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Nuestros Servicios</NavLink>
            </li>
            <li>
                <NavLink to="/aboutme" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Sobre Mi</NavLink>
            </li>
        </ul>
    );
};

export default DropdownAbout;