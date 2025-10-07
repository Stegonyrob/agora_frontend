# 🔒 GUÍA DE SEGURIDAD - ÁGORA PROJECT

## ⚠️ INFORMACIÓN CRÍTICA DE SEGURIDAD

### Variables de Entorno
- **NUNCA** subas archivos `.env` reales a GitHub
- Solo el archivo `.env.example` debe estar en el repositorio
- Usa placeholders genéricos en `.env.example`
- Los archivos `.env.local`, `.env`, etc. están protegidos por `.gitignore`

### Configuración Segura

#### 1. Desarrollo Local
```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env.local

# 2. Edita .env.local con tus valores reales
# 3. NUNCA compartas este archivo
```

#### 2. Claves y Secretos
- Google OAuth: Obtén en [Google Cloud Console](https://console.cloud.google.com/)
- reCAPTCHA: Configura en [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- URLs del Backend: NUNCA uses URLs reales en archivos públicos

#### 3. Verificación de Seguridad
Antes de hacer commit, verifica:
- [ ] No hay URLs reales en `.env.example`
- [ ] Archivo `.env.local` no está en staging (`git status`)
- [ ] Todas las claves son placeholders en archivos públicos

### 🚨 Si Detectas una Vulnerabilidad

1. **NO** hagas commit si hay información sensible
2. Limpia el archivo inmediatamente
3. Verifica que no esté en staging
4. Considera cambiar las credenciales expuestas

### Archivos Protegidos por .gitignore
```
.env
.env.local
.env.development
.env.test
.env.production
.env.staging
.env.*
```

### ✅ Buenas Prácticas
- Usa variables de entorno del servidor en producción
- Rota credenciales periódicamente
- Implementa restricciones de dominio en APIs
- Monitorea accesos a servicios externos

---
**Recuerda**: La seguridad es responsabilidad de todos los desarrolladores.