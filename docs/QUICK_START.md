# 🚀 Guía Rápida: Conversión a Repositorio Privado

## 📋 Resumen Ejecutivo

Tu proyecto Ágora necesita dos versiones:
- **Pública** (portfolio, demo) → Sin datos sensibles
- **Privada** (producción) → Con endpoints y credenciales reales

---

## ⚡ Pasos Rápidos (15 minutos)

### 1️⃣ Crear Repositorio Privado en GitHub (2 min)

1. Ve a: https://github.com/new
2. Nombre: `agora_frontend_private`
3. ✅ Marca como **Private**
4. ❌ NO inicialices con README
5. Click "Create repository"

### 2️⃣ Clonar y Configurar Repo Privado (3 min)

```bash
# En tu terminal (PowerShell o CMD)
cd "d:\GITHUB\ÁGORA\Proyecto Personal"

# Crear copia del proyecto
xcopy agora_frontend agora_frontend_private /E /I /H

# Entrar a la copia
cd agora_frontend_private

# Cambiar remote a privado
git remote remove origin
git remote add origin https://github.com/Stegonyrob/agora_frontend_private.git

# Verificar
git remote -v
```

### 3️⃣ Configurar Variables de Entorno (5 min)

Crea `agora_frontend_private\.env.production`:

```env
# PRODUCCIÓN - VALORES REALES
VITE_API_BASE_URL=https://api.tudominio.com/api
VITE_RECAPTCHA_SITE_KEY=tu_clave_real_recaptcha
VITE_GOOGLE_MAPS_API_KEY=tu_clave_real_maps

VITE_APP_ENV=production
VITE_APP_NAME=Ágora Centro Educativo
VITE_ENABLE_DEBUG=false
```

### 4️⃣ Actualizar Configuración (3 min)

En `agora_frontend_private\src\config\environment.ts`:

```typescript
// Cambiar estos valores por los reales:
const privateConfig: ConfigService = {
  apiBaseUrl: 'https://api.tudominio.com/api',  // ← Tu URL real
  recaptchaSiteKey: process.env.VITE_RECAPTCHA_SITE_KEY || '',
  googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
  environment: 'production',
  appName: 'Ágora Centro Educativo',
  appVersion: '1.0.0',
};
```

### 5️⃣ Push al Repositorio Privado (2 min)

```bash
# Desde agora_frontend_private
git add .
git commit -m "chore: Configuración inicial repo privado"
git push -u origin main
```

✅ **¡Listo!** Tu repositorio privado está configurado.

---

## 🔒 Mantener Repositorio Público Seguro

### Verificar que el repo público NO tiene:

```bash
# En agora_frontend (público)
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend"

# Buscar posibles datos sensibles
findstr /S /I "api.tudominio.com" src\*
findstr /S /I "production" src\*.env*
dir /S /B .env .env.local .env.production

# Si encuentra algo, eliminarlo inmediatamente
```

### Actualizar README del repo público:

Agrega al inicio del `README.md`:

```markdown
> **⚠️ NOTA**: Esta es la versión pública/demo del proyecto.
> No incluye credenciales reales ni endpoints de producción.
> Para producción, se requiere configuración adicional.
```

---

## 🔄 Flujo de Trabajo Diario

### Desarrollar Nueva Funcionalidad

```bash
# 1. Trabajar en repo PRIVADO
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend_private"

git checkout -b feature/mi-nueva-funcionalidad

# 2. Desarrollar
code .
# ... hacer cambios ...

# 3. Probar
npm run dev
npm run test

# 4. Commit
git add .
git commit -m "feat: Mi nueva funcionalidad"
git push origin feature/mi-nueva-funcionalidad

# 5. Crear PR y mergear en GitHub
```

### Sincronizar a Repositorio Público (Opcional)

Solo cuando quieras actualizar tu portfolio:

```bash
# Opción A: Manual (más control)
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend"
# Copiar manualmente archivos seguros
# Revisar que no haya datos sensibles
git add .
git commit -m "sync: Actualización de funcionalidades"
git push

# Opción B: Script automatizado
cd "d:\GITHUB\ÁGORA\Proyecto Personal\agora_frontend_private"
bash scripts/sync-to-public.sh
```

---

## 📁 Estructura de Archivos Sensibles

### Solo en Repo PRIVADO:

```
agora_frontend_private/
├── .env.production          ← URLs y keys reales
├── .env.staging
├── src/config/
│   └── private.config.ts    ← Configuración producción
├── scripts/
│   ├── deploy.sh            ← Script de deploy
│   └── backup.sh
└── docs/
    └── DEPLOY.md            ← Guía deployment
```

### Solo en Repo PÚBLICO:

```
agora_frontend/
├── .env.example             ← Plantilla SIN valores reales
├── src/config/
│   └── public.config.ts     ← Config demo
└── README.md                ← Indica que es versión demo
```

---

## 🚨 Checklist de Seguridad Rápido

Antes de cada push al repo PÚBLICO:

- [ ] ✅ No hay archivos `.env` con valores reales
- [ ] ✅ No hay URLs de producción en el código
- [ ] ✅ No hay API keys reales
- [ ] ✅ README indica que es versión demo
- [ ] ✅ `.env.example` solo tiene placeholders

Comando rápido de verificación:

```bash
# Buscar patrones sensibles
cd agora_frontend
findstr /S /I "api\..*\.com" src\*
findstr /S /I "prod_" src\*
findstr /S /I "REAL_" src\*
```

---

## 🛠️ Comandos Útiles

```bash
# Ver diferencias entre repos
cd "d:\GITHUB\ÁGORA\Proyecto Personal"
fc /B agora_frontend\.env.example agora_frontend_private\.env.production

# Listar archivos .env
dir /S /B agora_frontend\.env*
dir /S /B agora_frontend_private\.env*

# Ver estado de Git
cd agora_frontend
git status
cd ..\agora_frontend_private
git status

# Ver remotes
git remote -v
```

---

## ❓ FAQ

**P: ¿Cuándo uso el repo público vs privado?**
- **Privado**: Todo desarrollo, producción, deploy
- **Público**: Portfolio, demos, compartir código sin datos sensibles

**P: ¿Puedo hacer desarrollo en el repo público?**
- No recomendado. Siempre desarrolla en privado y sincroniza después.

**P: ¿Qué hago si accidentalmente subí datos sensibles al público?**
1. Revoca/cambia inmediatamente las credenciales
2. Elimina el commit del historial (ver `SECURITY_CHECKLIST.md`)
3. Force push (solo si es absolutamente necesario)

**P: ¿Cómo comparto mi código con reclutadores?**
- Comparte el repo **público** (sin credenciales)
- Incluye `.env.example` con instrucciones
- Menciona que es versión demo

**P: ¿Necesito dos workspaces en VS Code?**
- Sí, uno para cada repositorio
- Evita confusiones al hacer commits

---

## 📞 Ayuda

Si algo sale mal:

1. **No entres en pánico**
2. No hagas más commits
3. Revisa `docs/SECURITY_CHECKLIST.md`
4. Si filtraste datos sensibles, cámbialos INMEDIATAMENTE

---

## ✅ Checklist Final

- [ ] Repositorio privado creado en GitHub
- [ ] Copia local del proyecto creada
- [ ] Remote configurado al repo privado
- [ ] `.env.production` creado con valores reales
- [ ] `environment.ts` actualizado
- [ ] Push inicial al repo privado completado
- [ ] Repo público verificado (sin datos sensibles)
- [ ] README público actualizado con nota de demo
- [ ] `.gitignore` revisado en ambos repos
- [ ] Tests funcionando en ambos repos

---

**Tiempo total**: ~15-20 minutos  
**Siguiente paso**: Desarrollar en el repo privado  
**Revisar**: `MIGRATION_GUIDE.md` para más detalles
