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
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",      // Púrpura elegante
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",      // Rosa profesional
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",      // Verde menta suave
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",      // Rosa-amarillo
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",      // Verde agua-rosa pastel
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",      // Naranja suave
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",      // Rosa coral
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",      // Lavanda-rosa
    "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",      // Melocotón-rosa
    "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"       // Malva-crema
  ];
  const menuItemsJSX = menuItems.map((item, index) => {
    const isMobile = window.innerWidth <= 768;
    const deg = index * (360 / menuItems.length);
    const transformStyle = active ? `rotate(${deg}deg) translate(${isMobile ? 7 : 15.5}rem)` : 'translate(0)';
    const reverseDeg = -deg;
    const gradientColor = colors[index % colors.length];

    return (
      <a
        key={index}
        href={item.path}
        className={styles.menuItem}
        style={{
          transform: `${transformStyle} rotate(${reverseDeg}deg)`,
          transitionDelay: `${index * 0.06}s`,
          '--gradient-overlay': gradientColor,
        } as React.CSSProperties & { '--gradient-overlay': string }}
      >
        <div
          className={styles.gradientOverlay}
          style={{ background: gradientColor }}
        />
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
