import { useState } from 'react';
import Logo from '../Logo/LogoAgora';
import styles from './MenuPicker.module.scss';


const ColorPickerMenu = () => {
  const [active, setActive] = useState(false);

  const toggleMenu = () => {
    setActive(prevActive => !prevActive);
  };

  const menuItems = [

    { name: "Sobre Mí", path: "/AboutMe" },
    { name: "Servicios", path: "/Services" },
    { name: "Blog", path: "/Blog" },
    { name: "Ágora", path: "/Agora" },
    { name: "TEA", path: "/Tea" },
    { name: "Tda/Tdh", path: "/Tda_Tdh" },
    { name: "T.Aprendizaje", path: "/Aprendizaje" },
    { name: "T.Madurativo", path: "/Madurativo" }
  ];
  const colors = ["rgba(215, 149, 216, 0.99)", "rgba(253, 217, 45, 1)", "rgba(74, 160, 73, 1)", "rgba(182, 159, 222, 1)"];
  const menuItemsJSX = menuItems.map((item, index) => {
    const isMobile = window.innerWidth <= 768;
    const deg = index * (360 / menuItems.length);
    const transformStyle = active ? `rotate(${deg}deg) translate(${isMobile ? 7 : 12.5}rem)` : 'translate(0)';
    const reverseDeg = -deg;
    return (
      <a
        key={index}
        href={item.path}
        className={styles.menuItem}
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
    <div className={styles.colorPickerMenuContainer}>
      <div className={`${styles.centralPicker} ${active ? 'active' : ''}`} onClick={toggleMenu}>
        <Logo />
      </div>
      <div className={styles.menuItemsContainer}>{menuItemsJSX}</div>
    </div>
  );
};

export default ColorPickerMenu;
