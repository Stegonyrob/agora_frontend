# Configuración de Login Social y Automático

## Características Implementadas

### 1. Login Automático después del Registro
- Después de un registro exitoso, el usuario se loguea automáticamente
- Redirección directa al blog/dashboard
- Manejo de errores si el login automático falla

### 2. Login Social (Google y Facebook)
- Botones de login con Google y Facebook en el formulario de login
- Integración con los SDKs oficiales
- Almacenamiento de tokens y datos de usuario

## Configuración Requerida

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con:

```env
# APIs del backend
VITE_API_ENDPOINT_USERS=http://localhost:8080/api/v1/any/user
VITE_API_ENDPOINT_LOGIN=http://localhost:8080/api/v1/all/login
VITE_API_ENDPOINT_LEGAL=http://localhost:8080/api/v1/any/legal

# Credenciales de Google OAuth
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com

# Credenciales de Facebook
VITE_FACEBOOK_APP_ID=tu-facebook-app-id
```

### Configuración de Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear un proyecto o seleccionar uno existente
3. Habilitar la API de Google+
4. Crear credenciales OAuth 2.0
5. Agregar los dominios autorizados:
   - `http://localhost:5173` (desarrollo)
   - `https://tu-dominio.com` (producción)

### Configuración de Facebook Login

1. Ir a [Facebook Developers](https://developers.facebook.com)
2. Crear una nueva aplicación
3. Configurar Facebook Login:
   - Agregar plataforma Web
   - Configurar URI de redirección válidas
4. Obtener el App ID de la aplicación

## Endpoints del Backend Requeridos

El backend debe implementar estos endpoints:

### Login Clásico
```
POST /api/v1/all/login
Body: { useremail: string, password: string }
Response: { userId: number, accessToken: string, refreshToken: string }
```

### Login con Google
```
POST /api/v1/all/login/google
Body: { token: string }
Response: { 
  userId: number, 
  accessToken: string, 
  refreshToken: string,
  user: { id: number, username: string, email: string, provider: 'google' }
}
```

### Login con Facebook
```
POST /api/v1/all/login/facebook
Body: { token: string }
Response: { 
  userId: number, 
  accessToken: string, 
  refreshToken: string,
  user: { id: number, username: string, email: string, provider: 'facebook' }
}
```

### Registro de Usuario
```
POST /api/v1/any/user/register
Body: { username: string, email: string, password: string }
Response: { id: number, username: string, email: string }
```

## Archivos Modificados

### Frontend
- `src/assets/Components/Login/FormLogin.tsx` - Integración del login social
- `src/assets/Components/Login/SocialLogin.tsx` - Componente de botones sociales
- `src/assets/Components/Login/SocialLogin.module.scss` - Estilos para login social
- `src/assets/Components/Register/RegisterForm.tsx` - Login automático post-registro
- `src/core/auth/AuthService.ts` - Servicio para autenticación clásica y social
- `src/core/user/UserRepository.ts` - Eliminación de headers en registro
- `index.html` - Scripts de Google y Facebook SDKs
- `vite-env.d.ts` - Tipos para variables de entorno

## Flujo de Autenticación

### Registro + Login Automático
1. Usuario llena formulario de registro
2. Sistema valida que las reglas fueron aceptadas
3. Registro en el backend
4. Login automático con las mismas credenciales
5. Redirección al blog

### Login Social
1. Usuario hace clic en botón de Google/Facebook
2. SDK abre popup de autenticación
3. Usuario autoriza la aplicación
4. Frontend recibe token de acceso
5. Token se envía al backend para validación
6. Backend retorna JWT y datos de usuario
7. Usuario queda logueado y es redirigido

## Testing

### Desarrollo Local
1. Configurar variables de entorno
2. Iniciar servidor de desarrollo: `npm run dev`
3. Probar registro y login automático
4. Probar login social (requiere HTTPS en producción)

### Producción
- Asegurar que todas las URLs estén en la whitelist de Google y Facebook
- Configurar HTTPS
- Validar que los tokens se manejen de forma segura

## Seguridad

- Los tokens se almacenan en `sessionStorage` (se pierden al cerrar el navegador)
- Los SDKs de Google y Facebook manejan la autenticación de forma segura
- El backend debe validar todos los tokens recibidos
- Implementar rate limiting en los endpoints de login

## Troubleshooting

### Error 401 en Registro
- Verificar que `UserRepository.register()` no envíe headers de autenticación
- El endpoint debe ser público (`/api/v1/any/user/register`)

### SDKs no cargan
- Verificar que `index.html` incluya los scripts
- Verificar que las variables de entorno estén configuradas
- Revisar la consola del navegador para errores

### Login social falla
- Verificar que las credenciales de OAuth estén correctas
- Verificar que el dominio esté autorizado
- Revisar logs del backend para errores de validación de tokens
