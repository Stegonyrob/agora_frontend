import { useState } from 'react';
import LogoPicker from '../Logo/LogoPicker';
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
    { name: "Eventos", path: "/Events" },
    { name: "Ágora", path: "/Agora" },
    { name: "CEA/TEA", path: "/Cea" },
    { name: "Tda/Tdh", path: "/Tda_Tdh" },
    { name: "Dif.Aprendizaje", path: "/LearningDifficulties" },
    { name: "Cond.Desarrollo", path: "/DevelopmentConditions" },
    { name: "Trans.Comunicación", path: "/Communication" },
  ];
  const colors = [
    "rgba(255, 105, 180, 0.95)",   // rosa intenso
    "rgba(255, 230, 80, 0.95)",    // amarillo intenso
    "rgba(80, 255, 180, 0.95)",    // verde menta intenso
    "rgba(255, 167, 38, 0.95)",    // naranja intenso
    "rgba(150, 120, 255, 0.95)",   // lila intenso
    "rgba(255, 120, 120, 0.95)",   // coral intenso
    "rgba(255, 220, 60, 0.95)",    // crema intenso
    "rgba(80, 255, 200, 0.95)",    // verde agua intenso
    "rgba(255, 200, 221, 0.95)",   // rosa pastel
    "rgba(197, 255, 221, 0.95)"    // verde menta pastel
  ];
  const menuItemsJSX = menuItems.map((item, index) => {
    const isMobile = window.innerWidth <= 768;
    const deg = index * (360 / menuItems.length);
    const transformStyle = active ? `rotate(${deg}deg) translate(${isMobile ? 7 : 15.5}rem)` : 'translate(0)';
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
      <div
        className={`${styles.centralPicker} ${active ? styles.active : ''}`}
        onClick={toggleMenu}
        tabIndex={0}
        aria-label="Abrir menú de navegación"
        role="button"
      >
        <LogoPicker />
        <span className={styles.clickMe}>Click Me</span>
      </div>
      <div className={styles.menuItemsContainer}>{menuItemsJSX}</div>
    </div>
  );
};

export default ColorPickerMenu;
