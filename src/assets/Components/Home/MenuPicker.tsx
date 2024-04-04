import { useState } from 'react';
import Logo from '../Logo/LogoAgora';
import './MenuPicker.scss';


const ColorPickerMenu = () => {
 const [active, setActive] = useState(false);

 const toggleMenu = () => {
    setActive(prevActive => !prevActive);
 };

 const menuItems = [
    
    { name: "Sobre Mí", path: "/AboutMe" },
    { name: "Servicios", path: "/Services" },
    { name: "Foro", path: "/Foro" },
    { name: "Ágora", path: "/Agora" },
    { name: "TEA", path: "/Tea" },
    { name: "Tda/Tdh", path: "/Tda_Tdh" },
    { name: "T.Aprendizaje", path: "/Aprendizaje" },
    { name: "T.Madurativo", path: "/Madurativo" }
 ];
 const colors = ["rgba(215, 149, 216, 0.99)", "rgba(253, 217, 45, 1)", "rgba(74, 160, 73, 1)", "rgba(182, 159, 222, 1)"];

 const menuItemsJSX = menuItems.map((item, index) => {
  const deg = index * (360 / menuItems.length);
  const transformStyle = active ? `rotate(${deg}deg) translate(12.5rem)` : 'translate(0)';
  const reverseDeg = -deg; 
  return (
    <a
    key={index}
    href={item.path}
    className="menu-item"
    style={{
      transform: `${transformStyle} rotate(${reverseDeg}deg)`,
      transitionDelay: `${index * 0.1}s`,
      backgroundColor: colors[index % colors.length] 
    }}
  >
       {item.name}
     </a>
  );
 });
 

 return (
    <div className="color-picker-menu-container">
      <div className={`central-picker${active ? ' active' : ''}`} onClick={toggleMenu}>
      <Logo/>
      
      </div>
      <div className="menu-items-container">{menuItemsJSX}</div>
    </div>
 );
};

export default ColorPickerMenu;
