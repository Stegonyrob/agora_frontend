# React + Vite

# Agora Frontend

## Descripción del Proyecto

Agora Frontend es una plataforma web que permite a los usuarios interactuar a través de diferentes características como publicaciones, registro, inicio de sesión y acceso a vistas relacionadas con diversos temas. Este proyecto se centra en crear una plataforma para la comunicación, el intercambio de información y la interacción del usuario.

## Tecnologías Utilizadas

- **React**: Utilizado para construir los componentes de la interfaz de usuario.
- **Vite**: Utilizado como herramienta de compilación para un desarrollo rápido y HMR (Hot Module Replacement).
- **Redux Toolkit**: Para la gestión del estado de la aplicación.
- **React Router Dom**: Para el manejo de enrutamiento dentro de la aplicación.
- **Axios**: Para realizar solicitudes HTTP a un servidor backend.
- **Bootstrap**, **MDB React UI Kit**: Para estilos y componentes de UI.
- **Jest**, **Mocha**, **Chai**: Para pruebas de la aplicación.
- **TypeScript**: Para verificación de tipos y mejora de la calidad del código.
- **ESLint**: Para mantener la calidad del código y hacer cumplir estándares de codificación.

## Organización del Código

El proyecto está organizado en varios directorios y archivos, incluyendo:

- **src**: Contiene el código fuente principal de la aplicación.
 - **assets**: Contiene imágenes y otros activos estáticos utilizados en la aplicación.
 - **Components**: Contiene componentes de UI reutilizables.
 - **Hooks**: Contiene hooks personalizados utilizados en la aplicación.
 - **redux**: Contiene la configuración de la tienda Redux y los slices para la gestión del estado.
 - **scss**: Contiene estilos SCSS globales.
 - **tests**: Contiene archivos de prueba para probar componentes y funcionalidades.
 - **Views**: Contiene diferentes vistas de la aplicación.
- **core**: Contiene funcionalidades principales relacionadas con la autenticación, publicaciones y gestión de usuarios.
- **stores**: Contiene slices de Redux para diferentes entidades.
- **services**: Contiene el servicio de API para realizar solicitudes HTTP.
- **types**: Contiene definiciones de tipos para imágenes.

## Scripts

- **dev**: Inicia el servidor de desarrollo usando Vite.
- **build**: Construye el código listo para producción.
- **lint**: Limpia el código usando ESLint.

## Instalación y Ejecución

1. Clona el repositorio:
cd agora_frontend
```

2. **Instalar dependencias**

```bash
npm install

3. Inicia el servidor de desarrollo:
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

Las contribuciones son bienvenidas. Por favor, lee el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para obtener detalles sobre cómo contribuir a este proyecto.

