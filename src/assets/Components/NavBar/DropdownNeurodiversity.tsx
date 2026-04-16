// src/assets/Components/NavBar/Dropdowns/DropdownNeurodiversidad.tsx

import { NavLink } from 'react-router-dom';

const DropdownNeurodiversity = () => {
    return (
        <ul className="dropdown-content-two">
            <li>
                <NavLink to="/neurodiversity" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>¿Qué es?</NavLink>
            </li>
            <li>
                <NavLink to="/tea" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Cea/Tea</NavLink>
            </li>
            <li>
                <NavLink to="/tda_tdh" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Tda_Tdh</NavLink>
            </li>
            <li>
                <NavLink to="/learningdifficulties" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Dificultades del Aprendizaje</NavLink>
            </li>
            <li>
                <NavLink to="/developmentconditions" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Condiciones del Desarrollo</NavLink>
            </li>
            <li>
                <NavLink to="/communication" className={({ isActive }) => (isActive ? 'dropdown-link active' : 'dropdown-link')}>Trastornos de la Comunicación</NavLink>
            </li>
        </ul>
    );
};

export default DropdownNeurodiversity;