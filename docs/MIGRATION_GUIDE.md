# 🔒 Guía de Migración: Repositorio Público → Privado

## 📊 Estrategia Dual: Repo Público (Portfolio) + Repo Privado (Producción)

---

## 🎯 Objetivo

Mantener dos versiones del proyecto:
- **Repositorio PÚBLICO**: Para portfolio, demos y contribuciones open-source
- **Repositorio PRIVADO**: Para producción con endpoints y credenciales reales

---

## 📋 PASO 1: Preparar el Repositorio Actual (Público)

### 1.1 Limpiar información sensible

```bash
# En tu directorio actual
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend"

# Verificar que no hay datos sensibles
git log --all --full-history --source --full-diff -- .env
git log --all --full-history --source --full-diff -- .env.local
```

### 1.2 Actualizar .gitignore

Asegúrate que `.gitignore` incluya:

```gitignore
# Variables de entorno
.env
.env.local
.env.*.local
.env.production
.env.staging

# Archivos de configuración sensibles
src/config/private.ts
src/config/credentials.ts

# Logs
*.log
npm-debug.log*

# Datos sensibles
/secrets/
/keys/
*.pem
*.key
*.cert
```

### 1.3 Reemplazar valores en el código

**Archivos a revisar:**
- Todos los archivos en `src/core/*/` que tengan URLs hardcodeadas
- Componentes que hagan fetch directo sin usar el servicio centralizado
- Cualquier referencia a dominios de producción

---

## 📋 PASO 2: Crear el Repositorio Privado

### 2.1 Crear una copia limpia del proyecto

```bash
# Desde el directorio padre
cd "d:\GITHUB\ÁGORA\Proyecto Personal"

# Crear copia para repo privado
cp -r agora_frontend agora_frontend_prod

cd agora_frontend_prod
```

### 2.2 Crear repo privado en GitHub

1. Ve a GitHub → "New Repository"
2. Nombre: `agora_frontend_private` o `agora_frontend_prod`
3. **Marca como PRIVADO** ✅
4. NO inicialices con README

### 2.3 Configurar remote del repo privado

```bash
# Remover el remote actual
git remote remove origin

# Agregar el nuevo remote privado
git remote add origin https://github.com/Stegonyrob/agora_frontend_private.git

# Verificar
git remote -v
```

### 2.4 Crear archivo de configuración privada

Crea `src/config/private.config.ts` (solo en repo privado):

```typescript
// SOLO EN REPOSITORIO PRIVADO
export const privateConfig = {
  apiBaseUrl: 'https://api.agoracentroeducativo.com/api',
  recaptchaSiteKey: 'tu_clave_real_recaptcha',
  googleMapsApiKey: 'tu_clave_real_maps',
  googleClientId: 'tu_client_id_real.apps.googleusercontent.com',
  
  // Endpoints específicos de producción
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      // ... etc
    }
  }
};
```

### 2.5 Crear .env de producción

```bash
# En agora_frontend_prod/
cp .env.production.example .env.production

# Editar con valores reales
nano .env.production  # o tu editor favorito
```

### 2.6 Push al repo privado

```bash
# Primera subida al repo privado
git push -u origin main

# Verificar que se subió correctamente
# Ve a GitHub y verifica que el repo sea PRIVADO
```

---

## 📋 PASO 3: Configurar el Repositorio Público

### 3.1 Regresar al repo público

```bash
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend"
```

### 3.2 Crear README público específico

Actualiza `README.md` para indicar que es la versión pública:

```markdown
# 🌐 Ágora - Plataforma de Neurodiversidad (DEMO)

> **Nota**: Esta es la versión pública/demo del proyecto con fines de portfolio.
> No incluye credenciales reales ni endpoints de producción.

## ⚠️ Versión Demo

Esta versión está configurada para funcionar con:
- Backend local de desarrollo
- API keys de demo
- Datos de prueba

Para una instalación funcional, necesitarás:
1. Configurar tu propio backend
2. Obtener tus propias API keys
3. Ver el archivo `.env.example` para la configuración requerida
```

### 3.3 Sanitizar código para versión pública

Crear `src/config/public.config.ts`:

```typescript
// VERSIÓN PÚBLICA - SIN CREDENCIALES REALES
export const publicConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'demo_key',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo_key',
  
  // URLs de ejemplo
  demoUrls: {
    backend: 'http://localhost:8080',
    frontend: 'http://localhost:5173'
  }
};
```

---

## 📋 PASO 4: Diferencias Entre Repositorios

### 🔴 Archivos SOLO en Repo PRIVADO:

```
agora_frontend_private/
├── .env.production          ← Credenciales reales
├── .env.staging             ← Credenciales staging
├── src/config/
│   ├── private.config.ts    ← Config producción
│   └── credentials.ts       ← API keys reales
├── scripts/
│   ├── deploy.sh            ← Script deploy
│   └── backup.sh            ← Script respaldo
└── docs/
    └── DEPLOY.md            ← Guía deploy producción
```

### 🟢 Archivos en Repo PÚBLICO:

```
agora_frontend/
├── .env.example             ← Plantilla con placeholders
├── src/config/
│   └── public.config.ts     ← Config demo/desarrollo
├── README.md                ← README para portfolio
└── docs/
    ├── SETUP.md             ← Guía instalación desarrollo
    └── CONTRIBUTING.md      ← Guía contribución
```

---

## 📋 PASO 5: Workflow de Desarrollo

### 5.1 Flujo normal de trabajo

```bash
# 1. Trabajar en el repo PRIVADO
cd agora_frontend_private
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar y testear
npm run dev
npm run test

# 3. Commit y push
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# 4. Crear PR en repo privado
# Revisar y mergear
```

### 5.2 Sincronizar cambios al repo público

```bash
# 1. Desde repo PRIVADO, copiar cambios sin datos sensibles
cd agora_frontend_private

# 2. Exportar cambios específicos
git format-patch main --stdout > ../cambios.patch

# 3. Ir al repo PÚBLICO
cd ../agora_frontend

# 4. Aplicar cambios
git apply ../cambios.patch

# 5. Revisar y limpiar cualquier dato sensible
git diff

# 6. Commit al repo público
git add .
git commit -m "sync: Sincronizar cambios desde privado"
git push origin main
```

### 5.3 Script de sincronización

Crear `scripts/sync-to-public.sh`:

```bash
#!/bin/bash

# Script para sincronizar cambios del repo privado al público
# Uso: ./sync-to-public.sh

set -e

PRIVATE_DIR="d:/GITHUB/ÁGORA/Proyecto Personal/agora_frontend_private"
PUBLIC_DIR="d:/GITHUB/ÁGORA/Proyecto Personal/agora_frontend"

echo "🔄 Iniciando sincronización..."

# Archivos a excluir de la sincronización
EXCLUDE_FILES=(
  ".env"
  ".env.production"
  ".env.staging"
  "src/config/private.config.ts"
  "src/config/credentials.ts"
  "scripts/deploy.sh"
  "docs/DEPLOY.md"
)

# Copiar archivos seguros
rsync -av --exclude-from=<(printf '%s\n' "${EXCLUDE_FILES[@]}") \
  "$PRIVATE_DIR/" "$PUBLIC_DIR/"

echo "✅ Sincronización completada"
echo "⚠️  Revisar cambios antes de hacer push al repo público"
```

---

## 📋 PASO 6: Deployment (Solo Repo Privado)

### 6.1 Configurar CI/CD

Crear `.github/workflows/deploy.yml` (solo en privado):

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_RECAPTCHA_SITE_KEY: ${{ secrets.RECAPTCHA_KEY }}
        VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.MAPS_KEY }}
      run: npm run build
      
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@v2
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
        ARGS: "-avz --delete"
        SOURCE: "dist/"
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/agora"
```

### 6.2 Configurar GitHub Secrets

En GitHub (repo privado) → Settings → Secrets → Actions:

- `API_BASE_URL`
- `RECAPTCHA_KEY`
- `MAPS_KEY`
- `SSH_KEY`
- `REMOTE_HOST`
- `REMOTE_USER`

---

## 📋 PASO 7: Mantenimiento

### 7.1 Actualizar ambos repos

```bash
# Cuando hagas cambios importantes en privado:

# 1. Commit en privado
cd agora_frontend_private
git add .
git commit -m "feat: Nueva funcionalidad"
git push

# 2. Sincronizar a público (sin datos sensibles)
./scripts/sync-to-public.sh

# 3. Revisar y push a público
cd ../agora_frontend
git status
git diff
git add .
git commit -m "sync: Actualización desde privado"
git push
```

### 7.2 Checklist de seguridad

Antes de cada push al repo público, verificar:

- [ ] No hay archivos `.env` con valores reales
- [ ] No hay URLs de producción hardcodeadas
- [ ] No hay API keys reales en el código
- [ ] No hay credenciales en comentarios
- [ ] No hay tokens o secretos
- [ ] README indica que es versión demo
- [ ] `.env.example` solo tiene placeholders

---

## 🚨 IMPORTANTE: Qué NUNCA debe estar en el repo público

❌ URLs de producción reales
❌ API keys de servicios
❌ Tokens de autenticación
❌ Credenciales de base de datos
❌ Claves privadas (SSH, SSL)
❌ Secrets de OAuth
❌ Información de servidores
❌ Logs con datos sensibles
❌ Backups de base de datos

---

## ✅ Resumen de Comandos

```bash
# CREAR REPO PRIVADO
cp -r agora_frontend agora_frontend_prod
cd agora_frontend_prod
git remote remove origin
git remote add origin https://github.com/Stegonyrob/agora_frontend_private.git
git push -u origin main

# SINCRONIZAR CAMBIOS
cd agora_frontend_private
# ... hacer cambios ...
git add . && git commit -m "feat: cambios" && git push

cd ../agora_frontend
./scripts/sync-to-public.sh
git add . && git commit -m "sync: desde privado" && git push

# VERIFICAR SEGURIDAD
git log --all --full-history --source -- .env
grep -r "api.agoracentroeducativo" src/
```

---

## 📚 Recursos Adicionales

- [GitHub: About private repositories](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [Git: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vite: Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Creado para**: Proyecto Ágora  
**Fecha**: Noviembre 2025  
**Versión**: 1.0
