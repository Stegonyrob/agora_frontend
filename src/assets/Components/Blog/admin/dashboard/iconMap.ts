// iconMap.tsx
// Mapea claves de menú a iconos de Bootstrap Icons

// Permite usar componentes React además de strings para iconos personalizados

import { InfinityIcon } from "../../../NavBar/Icons";

import { MdMenuBook } from "react-icons/md";
// Componente para el icono de dificultades de aprendizaje (libro abierto Material Design)
import React from "react";
const BookOpenReaderIcon: React.FC<any> = (props) =>
  React.createElement(MdMenuBook, props);

export const iconMap: Record<string, any> = {
  "home-admin": "bi-house-door",
  "home-user": "bi-house",
  "agora-admin": "bi-buildings",
  "agora-user": "bi-buildings",
  "aboutme-admin": "bi-person-badge",
  "aboutme-user": "bi-person",
  "servicios-admin": "bi-briefcase",
  "servicios-user": "bi-briefcase",
  // Usar icono infinito a color para neurodiversidad
  "neurodiversidad-admin": InfinityIcon,
  "neurodiversidad-user": InfinityIcon,
  "cea-admin": "bi-infinity",
  "cea-user": "bi-infinity",
  "tda-admin": "bi-emoji-laughing", // persona distraída
  "tda-user": "bi-emoji-laughing",
  "dificultades-admin": BookOpenReaderIcon,
  "dificultades-user": BookOpenReaderIcon,
  "condiciones-admin": "bi-bar-chart", // sugerencia: gráfico de barras (crecimiento/desarrollo)
  "condiciones-user": "bi-bar-chart",
  "eventos-admin": "bi-calendar-event",
  "eventos-user": "bi-calendar-event",
  "blog-admin": "bi-journal-richtext",
  "blog-user": "bi-journal-richtext",
  "perfil-admin": "bi-person-circle",
  "perfil-user": "bi-person-circle",
  "usuarios-admin": "bi-people-fill",
  login: "bi-box-arrow-in-right",
  "terminos-admin": "bi-file-earmark-text",
  "terminos-user": "bi-file-earmark-text",
  "privacidad-admin": "bi-shield-lock",
  "privacidad-user": "bi-shield-lock",
  "cookies-admin": "bi-cookie",
  "cookies-user": "bi-cookie",
  "reglas-blog-admin": "bi-list-check",
  "reglas-blog-preview": "bi-list-check",
};
