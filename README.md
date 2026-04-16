# 🌐 Ágora - Plataforma de Neurodiversidad

> **⚠️ NOTA**: Esta es la versión **pública/demo** del proyecto con fines de portfolio y documentación.  
> No incluye credenciales reales ni endpoints de producción.  
> Para configuración de producción, consulta `docs/QUICK_START.md`

<div align="center">
  <img src="public/images/img/logo.png" alt="Ágora Logo" width="200"/>
  
  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 📋 Descripción

**Ágora** es una plataforma web innovadora diseñada para promover y celebrar la **neurodiversidad**. La aplicación proporciona un espacio inclusivo donde personas neurodivergentes pueden conectar, compartir experiencias, participar en eventos y acceder a recursos educativos sobre neurodiversidad.

### 🎯 Características Principales

- 📝 **Sistema de Publicaciones y Blog**: Comparte artículos, experiencias y recursos
- 📅 **Gestión de Eventos**: Crea y participa en talleres, conferencias y actividades
- 👥 **Sistema de Comentarios y Respuestas**: Interacción comunitaria
- ⭐ **Favoritos**: Guarda publicaciones y eventos de interés
- 🎨 **Personalización de Avatar**: Generación dinámica con DiceBear
- ♿ **Accesibilidad Avanzada**:
  - Modo daltónico con ajustes de color
  - Alto contraste para mejor visibilidad
  - Escala de grises
  - Ajuste de tamaño de fuente
  - Lectura de texto por voz (TTS)
- 🔐 **Autenticación y Autorización**: Sistema seguro con roles de usuario
- 👨‍💼 **Panel de Administración**: Gestión completa de contenido y usuarios
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- 🌍 **Integración con WhatsApp**: Comunicación directa
- 📧 **Formulario de Contacto**: Con validación y reCAPTCHA

## 🛠️ Stack Tecnológico

### Frontend Core
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5.4.2** - Tipado estático
- **Vite 6.3.5** - Build tool y dev server
- **React Router DOM 6.22.3** - Enrutamiento SPA

### Gestión de Estado
- **Redux Toolkit 2.2.2** - State management
- **React Redux 9.0.4** - Bindings React-Redux
- **SWR 2.2.5** - Data fetching con caché
- **TanStack Query 5.62.3** - Server state management

### UI/UX
- **Bootstrap 5.3.2** - Framework CSS
- **React Bootstrap 2.10.0** - Componentes Bootstrap para React
- **SASS 1.69.7** - Preprocesador CSS
- **Material-UI 7.3.2** - Componentes Material Design
- **Bootstrap Icons 1.13.1** - Iconografía
- **FontAwesome 6.7.2** - Iconos adicionales
- **Radix UI Themes 3.1.6** - Componentes primitivos accesibles

### Formularios y Validación
- **React Hook Form 7.51.1** - Gestión de formularios
- **Zod 3.24.0** - Validación de esquemas
- **React Google reCAPTCHA 3.1.0** - Protección contra bots

### Utilidades
- **Axios 1.15.0** - Cliente HTTP
- **date-fns 4.1.0** - Manipulación de fechas
- **DOMPurify 3.2.4** - Sanitización de HTML
- **ExcelJS 4.4.0** - Exportación de datos
- **crypto-js 4.2.0** - Encriptación
- **UUID 11.1.0** - Generación de identificadores únicos
- **react-i18next 15.5.2** - Internacionalización (i18n)
- **TinyMCE 6** - Editor de texto enriquecido (WYSIWYG)
- **Appwrite 16.0.2** - BaaS para almacenamiento y servicios backend

### Testing
- **Vitest 3.1.4** - Framework de testing
- **Testing Library** - Testing de componentes React
- **Jest 29.7.0** - Test runner alternativo
- **Axios Mock Adapter 1.22.0** - Mocking de requests

### Desarrollo
- **ESLint 8.57.0** - Linter
- **Babel** - Transpilador
- **SWC** - Compilador rápido para Vite

## 📁 Estructura del Proyecto

```
agora_frontend/
├── public/                      # Archivos estáticos
│   ├── images/
│   │   ├── avatars/            # Avatares de usuarios
│   │   └── img/                # Imágenes generales
├── src/
│   ├── assets/                 # Assets del proyecto
│   │   ├── Components/         # Componentes React
│   │   │   ├── Admin/         # Panel de administración
│   │   │   ├── Avatar/        # Sistema de avatares
│   │   │   ├── Blog/          # Blog y publicaciones
│   │   │   ├── Events/        # Gestión de eventos
│   │   │   ├── Legal/         # Textos legales
│   │   │   ├── NavBar/        # Barra de navegación
│   │   │   └── Settings/      # Configuración y accesibilidad
│   │   ├── icons/             # Iconos SVG
│   │   ├── scss/              # Estilos globales SCSS
│   │   └── Views/             # Vistas principales
│   ├── core/                   # Lógica de negocio
│   │   ├── admin/             # Servicios admin
│   │   ├── auth/              # Autenticación
│   │   ├── events/            # Gestión eventos
│   │   ├── posts/             # Publicaciones
│   │   ├── comments/          # Comentarios
│   │   ├── profiles/          # Perfiles de usuario
│   │   └── settings/          # Configuración
│   ├── hooks/                  # Custom hooks
│   │   ├── useColorBlindMode.tsx
│   │   ├── useHighContrast.tsx
│   │   ├── useFontSize.tsx
│   │   └── useEvents.ts
│   ├── redux/                  # Redux store
│   │   └── store.ts
│   ├── routes/                 # Configuración de rutas
│   │   ├── PrivateLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/               # Servicios API
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilidades
│   ├── __tests__/             # Tests unitarios
│   ├── App.tsx                # Componente raíz
│   └── main.tsx               # Entry point
├── .env.example               # Variables de entorno ejemplo
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts

```

## 🚀 Instalación y Configuración

### Prerequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Stegonyrob/agora_frontend.git
cd agora_frontend
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales (nunca subas este archivo a git):

```env
VITE_API_ENDPOINT_GENERAL=http://localhost:8080/api/v1
VITE_RECAPTCHA_SITE_KEY=tu_clave_recaptcha
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
VITE_GOOGLE_CLIENT_ID=tu_client_id
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint en el código |
| `npm run test` | Ejecuta los tests unitarios |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura de tests |
| `npm run test:ui` | Abre la interfaz visual de Vitest |

## 🧪 Testing

El proyecto utiliza **Vitest** y **Testing Library** para testing:

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ver interfaz visual de tests
npm run test:ui
```

### Cobertura de Tests

El proyecto mantiene umbrales de cobertura del 70% en:
- Ramas (branches)
- Funciones (functions)
- Líneas (lines)
- Sentencias (statements)

## 🌈 Características de Accesibilidad

Ágora está diseñado con accesibilidad como prioridad:

### Modos Visuales
- **Modo Daltónico**: Ajusta colores para deuteranopia (daltonismo rojo-verde)
- **Alto Contraste**: Mejora la visibilidad con contraste aumentado
- **Escala de Grises**: Modo monocromático

### Personalización
- **Tamaño de Fuente**: Pequeña, Mediana, Grande
- **Animaciones**: Opción de deshabilitar animaciones
- **Lectura por Voz**: Text-to-Speech integrado

### Persistencia
Todas las configuraciones se guardan:
- **localStorage** para usuarios no autenticados
- **Backend API** para usuarios registrados

## 🔐 Autenticación y Seguridad

- JWT para autenticación stateless
- Encriptación de contraseñas con crypto-js
- Protección CSRF
- Sanitización de HTML con DOMPurify
- reCAPTCHA v3 en formularios
- Roles y permisos (Usuario, Admin)

## 🎨 Sistema de Diseño

### Paleta de Colores Principal

```scss
$primary-purple: #667eea;
$secondary-purple: #764ba2;
$dark-bg: #1a1a1a;
$light-text: #f8f9fa;
```

### Breakpoints Responsive

- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- **NUNCA uses `!important`** en CSS (ver RULES.md)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: [Stegonyrob](https://github.com/Stegonyrob)

## 📞 Contacto

- **Email**: agoracentroeducativo@gmail.com
- **WhatsApp**: Disponible en la plataforma

## 🙏 Agradecimientos

- Comunidad de neurodiversidad por el feedback valioso
- Todos los contribuidores del proyecto
- Bibliotecas de código abierto utilizadas

---

<div align="center">
  Hecho con ❤️ para la comunidad neurodivergente
</div>

