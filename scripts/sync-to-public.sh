#!/bin/bash

# ============================================
# SCRIPT DE SINCRONIZACIÓN: PRIVADO → PÚBLICO
# ============================================
# 
# Este script sincroniza cambios del repositorio
# privado al público, excluyendo datos sensibles
#
# Uso: ./sync-to-public.sh [--dry-run]
#

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorios
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRIVATE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PUBLIC_DIR="$(cd "$SCRIPT_DIR/../../agora_frontend" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Sincronización: Privado → Público${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar que estamos en el repo privado
if [[ ! "$PRIVATE_DIR" =~ "private" ]] && [[ ! "$PRIVATE_DIR" =~ "prod" ]]; then
    echo -e "${RED}⚠️  ADVERTENCIA: No estás en el repositorio privado${NC}"
    echo -e "${YELLOW}Directorio actual: $PRIVATE_DIR${NC}"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Modo dry-run
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${YELLOW}🔍 Modo DRY-RUN activado (no se harán cambios reales)${NC}"
    echo ""
fi

# Archivos y directorios a EXCLUIR
EXCLUDE_PATTERNS=(
    # Variables de entorno
    ".env"
    ".env.local"
    ".env.production"
    ".env.staging"
    ".env.*.local"
    
    # Configuración privada
    "src/config/private.config.ts"
    "src/config/credentials.ts"
    "src/config/production.ts"
    
    # Scripts de deploy
    "scripts/deploy*.sh"
    "scripts/backup*.sh"
    
    # Documentación privada
    "docs/DEPLOY.md"
    "docs/PRODUCTION.md"
    "docs/SECRETS.md"
    
    # Directorio de secrets
    "secrets/"
    "keys/"
    
    # Certificados y claves
    "*.pem"
    "*.key"
    "*.cert"
    "*.p12"
    
    # Archivos de CI/CD privados
    ".github/workflows/deploy.yml"
    ".github/workflows/production.yml"
    
    # Node modules y builds
    "node_modules/"
    "dist/"
    "build/"
    ".vite/"
    
    # Logs
    "*.log"
    "logs/"
    
    # Cache
    ".cache/"
    ".parcel-cache/"
    
    # Git
    ".git/"
)

# Crear archivo temporal de exclusiones para rsync
EXCLUDE_FILE=$(mktemp)
printf '%s\n' "${EXCLUDE_PATTERNS[@]}" > "$EXCLUDE_FILE"

echo -e "${BLUE}📁 Directorios:${NC}"
echo -e "  Privado: ${GREEN}$PRIVATE_DIR${NC}"
echo -e "  Público: ${GREEN}$PUBLIC_DIR${NC}"
echo ""

# Verificar que el directorio público existe
if [ ! -d "$PUBLIC_DIR" ]; then
    echo -e "${RED}❌ El directorio público no existe: $PUBLIC_DIR${NC}"
    echo -e "${YELLOW}💡 Crea primero el repositorio público${NC}"
    exit 1
fi

# Mostrar archivos que serán excluidos
echo -e "${YELLOW}🚫 Archivos/directorios excluidos:${NC}"
cat "$EXCLUDE_FILE" | head -10
echo -e "${YELLOW}   ... (${#EXCLUDE_PATTERNS[@]} patrones en total)${NC}"
echo ""

# Confirmar antes de continuar
if [ "$DRY_RUN" = false ]; then
    read -p "$(echo -e ${YELLOW}¿Continuar con la sincronización? \(y/N\): ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        rm "$EXCLUDE_FILE"
        echo -e "${RED}❌ Sincronización cancelada${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}🔄 Iniciando sincronización...${NC}"
echo ""

# Ejecutar rsync
RSYNC_CMD="rsync -av --delete"

if [ "$DRY_RUN" = true ]; then
    RSYNC_CMD="$RSYNC_CMD --dry-run"
fi

$RSYNC_CMD \
    --exclude-from="$EXCLUDE_FILE" \
    --progress \
    "$PRIVATE_DIR/" \
    "$PUBLIC_DIR/"

# Limpiar archivo temporal
rm "$EXCLUDE_FILE"

echo ""
echo -e "${GREEN}✅ Sincronización completada${NC}"
echo ""

# Verificar cambios en el repo público
echo -e "${BLUE}📊 Verificando cambios en el repositorio público...${NC}"
cd "$PUBLIC_DIR"

# Mostrar estado de git
git status --short

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Revisar cambios antes de hacer commit${NC}"
echo -e "${YELLOW}📝 Pasos siguientes:${NC}"
echo -e "  1. ${BLUE}cd \"$PUBLIC_DIR\"${NC}"
echo -e "  2. ${BLUE}git diff${NC} ${YELLOW}# Revisar cambios${NC}"
echo -e "  3. ${BLUE}git add .${NC}"
echo -e "  4. ${BLUE}git commit -m \"sync: Actualización desde privado\"${NC}"
echo -e "  5. ${BLUE}git push origin main${NC}"
echo ""

# Verificar que no se hayan colado datos sensibles
echo -e "${BLUE}🔍 Verificando datos sensibles...${NC}"

SENSITIVE_PATTERNS=(
    "api.agoracentroeducativo.com"
    "production_key"
    "prod_key"
    "REAL_API_KEY"
    "SECRET_TOKEN"
)

FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if grep -r "$pattern" "$PUBLIC_DIR/src" 2>/dev/null | grep -v "node_modules" > /dev/null; then
        echo -e "${RED}⚠️  ADVERTENCIA: Encontrado patrón sensible: $pattern${NC}"
        FOUND_SENSITIVE=true
    fi
done

if [ "$FOUND_SENSITIVE" = true ]; then
    echo -e "${RED}❌ Se encontraron datos potencialmente sensibles${NC}"
    echo -e "${YELLOW}⚠️  Revisar antes de hacer push${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No se encontraron patrones sensibles obvios${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Sincronización finalizada${NC}"
echo -e "${GREEN}========================================${NC}"
