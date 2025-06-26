# 🔐 Guía Completa: Configuración de Login Social (Google & Facebook)

## 📋 Prerequisitos
- Cuenta de Google activa
- Cuenta de Facebook activa  
- Dominio o URL donde está tu aplicación (ej: `http://localhost:5173` para desarrollo)

---

## 🔵 PASO A PASO: CONFIGURAR GOOGLE OAUTH

### 🚀 MÉTODO RÁPIDO (Recomendado):
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. **Ve directamente a:** "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. **Si te pide configurar consent screen, sigue los pasos detallados abajo**

### 1. Acceder a Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google

### 2. Crear un Proyecto (si no tienes uno)
1. Haz clic en el selector de proyecto (parte superior)
2. Clic en "**NUEVO PROYECTO**"
3. Nombre: `Agora-Frontend` (o el que prefieras)
4. Clic en "**CREAR**"

### 3. Habilitar APIs necesarias
1. Ve a "**APIs & Services**" → "**Library**" (Biblioteca)
2. Busca "**Google Identity**" → Clic en "**ENABLE**" (Habilitar)
3. **Alternativa si no encuentras Google Identity:**
   - Busca "**People API**" → Clic en "**ENABLE**"
   - O busca "**Google+ API**" → Clic en "**ENABLE**" (si está disponible)

### 4. Configurar Pantalla de Consentimiento OAuth
1. Ve a "**APIs y servicios**" → "**Pantalla de consentimiento de OAuth**"
2. **Si es tu primera vez:**
   - Selecciona "**External**" (Externo) → Clic en "**CREATE**" (Crear)
   - **Si no aparece esta opción**, salta al paso 3
3. Completa la información obligatoria:
   - **App name** (Nombre de la aplicación): `Ágora Centro Educativo`
   - **User support email** (Correo de asistencia): tu email
   - **App logo** (opcional): sube tu logo
   - **Authorized domains** (Dominios autorizados): 
     - **DEJA ESTO VACÍO PARA DESARROLLO LOCAL**
     - NO agregues localhost aquí (Google no lo permite)
   - **Developer contact information**: tu email
4. Clic en "**SAVE AND CONTINUE**" (Guardar y continuar)
5. En la página "**Scopes**" (Ámbitos) → Clic en "**SAVE AND CONTINUE**"
6. En "**Test users**" (Usuarios de prueba):
   - Clic en "**ADD USERS**" (Agregar usuarios)
   - Agrega tu email
   - Clic en "**SAVE AND CONTINUE**"
7. Revisa el resumen y clic en "**BACK TO DASHBOARD**"

### 5. Crear Credenciales OAuth 2.0
1. Ve a "**APIs & Services**" → "**Credentials**" (Credenciales)
2. Clic en "**+ CREATE CREDENTIALS**" → "**OAuth 2.0 Client ID**"
3. **Si te pide configurar OAuth consent screen primero, hazlo (paso 4)**
4. Tipo de aplicación: "**Web application**" (Aplicación web)
5. Nombre: `Agora Frontend Web Client`
6. **Authorized JavaScript origins** (Orígenes de JavaScript autorizados):
   - Clic en "**ADD URI**" y agrega:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   ```
7. **Authorized redirect URIs** (URI de redirección autorizados):
   - **IMPORTANTE: Para nuestro caso, DEJA ESTO VACÍO**
   - Solo se necesita si tu app redirige a una página específica
   - Para login con popup (nuestro caso), no es necesario
8. Clic en "**CREATE**" (Crear)

### 6. Obtener Client ID
1. Después de crear las credenciales, aparecerá un popup con tu **Client ID**
2. Copia el "**Client ID**" (algo como: `123456789-abc123.apps.googleusercontent.com`)
3. **Si cerraste el popup:** Ve a "**Credentials**" → Clic en el nombre de tu cliente OAuth
4. Pégalo en tu `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
   ```

---

## 🆘 SI TIENES PROBLEMAS CON GOOGLE:

### ⚠️ ERROR: "Dominio no válido: Debe ser un dominio privado de nivel superior"
**SOLUCIÓN:**
1. **NO agregues** `localhost` en "Authorized domains" 
2. **DEJA VACÍO** el campo "Authorized domains" para desarrollo
3. **SOLO agrega** las URLs en "Authorized JavaScript origins":
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`

### Configuración Correcta para Desarrollo:
```
✅ Authorized JavaScript origins:
   http://localhost:5173
   http://127.0.0.1:5173

✅ Authorized domains: 
   (VACÍO - no agregar nada)

✅ Authorized redirect URIs:
   (VACÍO - no necesario para nuestro login)
```

### Interfaz en Español vs Inglés
Google Cloud Console puede aparecer en inglés o español. Aquí tienes ambas opciones:

**En Inglés:**
- APIs & Services → Library → Google Identity
- APIs & Services → OAuth consent screen → External → Create
- APIs & Services → Credentials → Create Credentials

**En Español:**
- APIs y servicios → Biblioteca → Google Identity  
- APIs y servicios → Pantalla de consentimiento → Externo → Crear
- APIs y servicios → Credenciales → Crear credenciales

### Si no encuentras "Externo/External":
1. **Busca una opción que diga "User Type"**
2. **O simplemente salta a crear las credenciales directamente**
3. **Google te guiará automáticamente**

---

## 🔴 PASO A PASO: CONFIGURAR FACEBOOK LOGIN

### 1. Acceder a Facebook Developers
1. Ve a [Facebook for Developers](https://developers.facebook.com/)
2. Inicia sesión con tu cuenta de Facebook

### 2. Crear una Aplicación
1. Clic en "**Mis aplicaciones**" → "**Crear aplicación**"
2. Selecciona "**Consumidor**" → "**Siguiente**"
3. Información de la aplicación:
   - **Nombre de la aplicación**: `Ágora Centro Educativo`
   - **Correo electrónico de contacto**: tu email
   - **Categoría de la aplicación**: `Educación`
4. Clic en "**Crear aplicación**"

### 3. Configurar Facebook Login
1. En el panel de la aplicación, busca "**Facebook Login**"
2. Clic en "**Configurar**"
3. Selecciona "**Web**" como plataforma
4. **URL del sitio**: `http://localhost:5173`
5. Clic en "**Guardar**"

### 4. Configurar Ajustes del Producto
1. Ve a "**Productos**" → "**Facebook Login**" → "**Configuración**"
2. **URI de redirección de OAuth válidos**:
   ```
   http://localhost:5173/
   http://localhost:3000/
   https://tu-dominio-produccion.com/
   ```
3. **Dominios de aplicación**: 
   - **DEJA VACÍO PARA DESARROLLO LOCAL**
   - Solo para dominios reales en producción
4. Activa "**Usar OAuth estricto para redirecciones**"
5. Clic en "**Guardar cambios**"

### 5. Configurar Ajustes Básicos
1. Ve a "**Configuración**" → "**Básica**"
2. **URL de la política de privacidad**: `https://tu-dominio.com/privacy`
3. **URL de las condiciones del servicio**: `https://tu-dominio.com/terms`
4. **Dominios de la aplicación**:
   - **DEJA VACÍO PARA DESARROLLO LOCAL**
   - Solo para producción: `tu-dominio-produccion.com`

### 6. Obtener App ID
1. En "**Configuración**" → "**Básica**"
2. Copia el "**Identificador de la aplicación**" (App ID)
3. Pégalo en tu `.env`:
   ```env
   VITE_FACEBOOK_APP_ID=1234567890123456
   ```

### 7. Hacer la Aplicación Pública (Para Producción)
1. Ve a "**Configuración**" → "**Básica**"
2. Cambia el **Estado de la aplicación** de "En desarrollo" a "**Activa**"
3. Completa todos los campos obligatorios si faltan

---

## ⚙️ CONFIGURACIÓN FINAL

### 1. Actualizar tu archivo .env
Tu archivo `.env` debería verse así:
```env
# Credenciales reales (reemplaza con las tuyas)
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=1234567890123456
```

### 2. Reiniciar el Servidor de Desarrollo
```bash
npm run dev
```

### 3. Probar en el Navegador
1. Ve a `http://localhost:5173/login`
2. Deberías ver los botones de Google y Facebook
3. Prueba hacer clic en cada uno

---

## 🔍 RESOLUCIÓN DE PROBLEMAS

### Error: "Client ID not found"
- ✅ Verifica que el Client ID esté correcto en `.env`
- ✅ Reinicia el servidor de desarrollo
- ✅ Revisa que no haya espacios extra en el `.env`

### Error: "Not authorized domain"  
- ✅ **PARA DESARROLLO:** Deja los "Authorized domains" VACÍOS en OAuth consent screen
- ✅ **SOLO agrega** las URLs en "Authorized JavaScript origins"
- ✅ **NO agregues** `localhost` en "Authorized domains"
- ✅ Verifica que la URL coincida exactamente: `http://localhost:5173`

### Facebook Login no funciona
- ✅ Verifica que la aplicación esté en modo "Activa" (no "En desarrollo")
- ✅ Agrega `localhost` a los dominios de la aplicación
- ✅ Completa la política de privacidad y términos

### SDKs no cargan
- ✅ Verifica tu conexión a internet
- ✅ Revisa la consola del navegador para errores
- ✅ Asegúrate de que no haya bloqueadores de anuncios

---

## 📱 PARA PRODUCCIÓN

### Dominios de Producción
Cuando subas a producción, agrega tu dominio real:

**Google:**
- Orígenes autorizados: `https://tu-dominio.com`
- URI de redirección: `https://tu-dominio.com`

**Facebook:**
- Dominios de aplicación: `tu-dominio.com`
- URI de redirección: `https://tu-dominio.com/`

### Variables de Entorno de Producción
```env
VITE_GOOGLE_CLIENT_ID=tu-client-id-real
VITE_FACEBOOK_APP_ID=tu-app-id-real
```

---

## ✅ VERIFICACIÓN FINAL

1. ✅ Google Client ID configurado
2. ✅ Facebook App ID configurado  
3. ✅ Dominios autorizados agregados
4. ✅ Aplicaciones activadas/públicas
5. ✅ Servidor reiniciado
6. ✅ Login social funciona correctamente

¡Listo! Tu login social debería funcionar perfectamente. 🎉
