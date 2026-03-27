# 🔒 Checklist de Seguridad - Repositorios Público/Privado

## ✅ Antes de Push al Repositorio PÚBLICO

### 📁 Archivos y Configuración

- [ ] Verificar que `.gitignore` incluye todos los archivos sensibles
- [ ] No existe archivo `.env` con valores reales
- [ ] No existe archivo `.env.production` con credenciales
- [ ] No existe archivo `.env.local` 
- [ ] `src/config/` solo contiene archivos públicos
- [ ] No hay archivos `*.pem`, `*.key`, `*.cert`

### 🔍 Código Fuente

- [ ] No hay URLs de producción hardcodeadas en el código
- [ ] No hay API keys reales en el código
- [ ] No hay tokens de autenticación en comentarios
- [ ] No hay credenciales de base de datos
- [ ] No hay secretos de OAuth reales
- [ ] Todos los endpoints usan variables de entorno

### 📝 Documentación

- [ ] README indica que es versión demo/pública
- [ ] `.env.example` solo contiene placeholders
- [ ] No hay guías de deployment con datos reales
- [ ] No hay IPs o dominios de servidores de producción

### 🧪 Verificación Automática

```bash
# Buscar patrones sensibles
grep -r "api.agoracentroeducativo.com" src/
grep -r "prod_key" src/
grep -r "production_" src/
grep -r "REAL_" src/

# Verificar archivos .env
find . -name ".env*" -not -name ".env.example"

# Verificar archivos de claves
find . -name "*.pem" -o -name "*.key" -o -name "*.cert"

# Verificar historial de Git
git log --all --full-history --source -- .env
```

---

## ✅ Configuración del Repositorio PRIVADO

### 🔐 GitHub Settings

- [ ] Repositorio marcado como **PRIVATE**
- [ ] Acceso restringido solo a colaboradores autorizados
- [ ] Branch protection activado en `main`
- [ ] Require pull request reviews activado
- [ ] Secrets de GitHub Actions configurados

### 📂 Archivos Sensibles Presentes

- [ ] `.env.production` con credenciales reales
- [ ] `src/config/private.config.ts` con configuración
- [ ] Scripts de deploy (`scripts/deploy.sh`)
- [ ] Documentación de producción (`docs/DEPLOY.md`)
- [ ] Certificados SSL/TLS si aplica

### 🚀 CI/CD

- [ ] Workflow de deploy configurado
- [ ] Secrets de GitHub Actions configurados
- [ ] Tests pasan antes de deploy
- [ ] Backup automático configurado

---

## ✅ Sincronización Entre Repositorios

### 📋 Antes de Sincronizar

- [ ] Commit y push en repositorio privado completado
- [ ] Tests pasan en repositorio privado
- [ ] No hay cambios pendientes en repositorio público

### 🔄 Durante la Sincronización

- [ ] Ejecutar `./scripts/sync-to-public.sh --dry-run` primero
- [ ] Revisar lista de archivos excluidos
- [ ] Confirmar que no se copian archivos sensibles

### 🔍 Después de Sincronizar

- [ ] Ejecutar `git diff` en repositorio público
- [ ] Verificar manualmente archivos modificados
- [ ] Buscar patrones sensibles
- [ ] Ejecutar tests en repositorio público
- [ ] Confirmar que la app funciona en modo demo

---

## ✅ Mantenimiento Regular

### 📅 Semanalmente

- [ ] Revisar commits en repositorio público
- [ ] Verificar que no se filtraron datos sensibles
- [ ] Actualizar dependencias en ambos repos
- [ ] Ejecutar auditoría de seguridad (`npm audit`)

### 📅 Mensualmente

- [ ] Rotar API keys si aplica
- [ ] Revisar accesos al repositorio privado
- [ ] Actualizar documentación de seguridad
- [ ] Verificar backups de producción

### 📅 Trimestralmente

- [ ] Auditoría completa de seguridad
- [ ] Revisar y actualizar `.gitignore`
- [ ] Revisar scripts de sincronización
- [ ] Actualizar guías de deployment

---

## 🚨 En Caso de Filtración de Datos

### Pasos Inmediatos

1. **STOP** - No hacer más commits
2. Identificar qué datos se filtraron
3. Revocar inmediatamente:
   - API keys expuestas
   - Tokens de autenticación
   - Credenciales de servicios
4. Cambiar contraseñas afectadas

### Limpieza del Historial

```bash
# Identificar commit con datos sensibles
git log --all --full-history --source -- ruta/archivo/sensible

# Usar BFG Repo-Cleaner (recomendado)
# https://reps-cleaner.github.io/

# O git filter-branch (alternativa)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch ruta/archivo/sensible" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (¡PELIGROSO! Solo si es necesario)
git push origin --force --all
```

### Notificación

- [ ] Notificar al equipo
- [ ] Documentar el incidente
- [ ] Actualizar procedimientos de seguridad
- [ ] Revisar logs de acceso

---

## 📊 Comandos Útiles

### Verificación de Seguridad

```bash
# Buscar archivos .env en historial
git log --all --full-history --source --full-diff -- ".env*"

# Buscar patrones sensibles en código
git grep -n "api\..*\.com" src/
git grep -n "[0-9]\{3\}\.[0-9]\{3\}\.[0-9]\{3\}\.[0-9]\{3\}" src/

# Listar archivos rastreados que deberían estar en .gitignore
git ls-files | grep -E "\\.env$|\\.pem$|\\.key$"

# Ver diferencias entre repos
diff -rq agora_frontend/ agora_frontend_private/ \
  --exclude=.git --exclude=node_modules
```

### Limpieza

```bash
# Eliminar archivos no rastreados
git clean -fdx

# Ver qué archivos serían eliminados
git clean -fdx --dry-run

# Eliminar del índice pero mantener local
git rm --cached archivo_sensible
```

---

## 📚 Referencias

- [GitHub: Managing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [12 Factor App: Config](https://12factor.net/config)

---

**Última actualización**: Noviembre 2025  
**Revisar cada**: Trimestre  
**Responsable**: Equipo de Desarrollo
