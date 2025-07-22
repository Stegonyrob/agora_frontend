// src/assets/Components/NavBar/Dropdowns/DropdownSesion.tsx

import { NavLink } from 'react-router-dom';

const DropdownSession = () => {
    return (
        <ul className="dropdown-content-tree">
            <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Login</NavLink>
            </li>
            <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Registro</NavLink>
            </li>
            <li>
                <NavLink to="/logout" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Logout</NavLink>
            </li>
        </ul>
    );
};

export default DropdownSession;