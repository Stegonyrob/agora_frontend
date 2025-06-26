# Sistema de Reglas de la Comunidad - Ágora

Este documento explica cómo implementar el sistema de reglas de la comunidad dinámicas y editables para el Centro de Apoyo Educativo Especializado Ágora.

## 📋 Características Implementadas

### 1. Reglas Dinámicas desde Backend
- Las reglas se cargan desde la base de datos usando el mismo sistema que los textos legales
- Son editables por el administrador
- Se actualizan automáticamente sin necesidad de redeployar la aplicación

### 2. Modal de Aceptación en Registro
- Popup modal obligatorio antes del registro
- El usuario debe aceptar las reglas para continuar
- Integración con el formulario de registro existente

### 3. Gestión Inteligente de Aceptación
- Verificación automática de si las reglas han sido actualizadas
- Re-solicitud de aceptación si las reglas han cambiado
- Almacenamiento en localStorage de la fecha de aceptación

### 4. Cumplimiento RGPD
- Información completa sobre derechos del usuario
- Contactos específicos para ejercer derechos
- Plazos de respuesta definidos

## 🗄️ Base de Datos

### Script SQL para Insertar las Reglas

Ejecuta el contenido del archivo `database_blog_rules.sql` en tu base de datos:

```sql
-- El script insertará las reglas con type='blog-rules'
-- Título: 'Reglas de la Comunidad Ágora'
-- Contenido: HTML con todas las reglas y normativas
```

### Estructura de la Tabla
Las reglas se almacenan en la tabla `legal_texts` con:
- `type`: 'blog-rules'
- `title`: Título de las reglas
- `content`: Contenido HTML de las reglas
- `updatedAt`: Fecha de última actualización

## 🧩 Componentes Creados

### 1. `BlogRules.tsx`
- Componente principal que carga las reglas desde el backend
- Maneja estados de loading, error y contenido
- Usa `LegalTextGeneric` para renderizar el contenido
- Fallback a reglas por defecto si falla la carga

### 2. `RulesModal.tsx`
- Modal para mostrar las reglas durante el registro
- Checkbox de aceptación obligatorio
- Botones de cancelar y continuar
- Responsive design

### 3. `BlogRulesView.tsx`
- Vista independiente para mostrar las reglas
- Accesible desde cualquier parte de la aplicación
- Mismo patrón que `TermsView`

### 4. `CommunityRulesView.tsx`
- Vista completa con navegación
- Información de contacto para RGPD
- Botón de volver
- Footer con información adicional

## 🎣 Hook Personalizado

### `useRulesAcceptance.tsx`
- Gestiona el estado de aceptación de reglas
- Verifica si las reglas han sido actualizadas
- Almacena la aceptación en localStorage
- Funciones para mostrar/ocultar modal y resetear aceptación

## 🔄 Integración con Registro

### Modificaciones en `RegisterForm.tsx`
1. **Importaciones añadidas:**
   ```tsx
   import RulesModal from '../Legal/RulesModal';
   import { useRulesAcceptance } from '../../../hooks/useRulesAcceptance';
   ```

2. **Estado gestionado por el hook:**
   ```tsx
   const {
     showRulesModal,
     rulesAccepted,
     canProceed: canProceedToRegister,
     showModal: showRulesModalHandler,
     hideModal: handleRulesModalClose,
     toggleAcceptance: handleRulesAcceptChange
   } = useRulesAcceptance(true);
   ```

3. **Validación en el submit:**
   - Verifica que las reglas hayan sido aceptadas
   - Bloquea el registro si no se han aceptado
   - Muestra mensaje de error apropiado

4. **Elementos UI añadidos:**
   - Modal de reglas
   - Aviso visual cuando no se han aceptado las reglas
   - Botón para mostrar reglas
   - Deshabilitación del botón de envío

## 🎨 Estilos

### `BlogRules.module.scss`
- Estilos para estados de loading, error y warning
- Responsive design
- Consistente con el diseño de la aplicación

### `RulesModal.module.scss`
- Modal full-responsive
- Estilos para checkbox de aceptación
- Botones con estados disabled
- Scrollbar personalizado

### `Views.module.scss`
- Estilos para la página independiente de reglas
- Header con botón de volver
- Footer con información de contacto
- Diseño responsive

## 🚀 Cómo Usar

### 1. Para Administradores
1. Accede al panel de administración
2. Ve a la sección de textos legales
3. Busca el tipo 'blog-rules'
4. Edita el contenido usando el editor HTML
5. Guarda los cambios

### 2. Para Desarrollo
1. Las reglas se cargan automáticamente al montar el componente
2. El modal aparece automáticamente en el registro
3. Las reglas se re-verifican si cambian en el backend
4. El sistema es completamente transparente para el usuario

### 3. Para Navegación
- Ruta recomendada: `/reglas-comunidad` o `/blog-rules`
- Accesible desde footer, header o enlaces directos
- Vista independiente con navegación completa

## 🔧 Configuración de Rutas

Añade a tu router:

```tsx
// Para la vista independiente
{
  path: "/reglas-comunidad",
  element: <BlogRulesView />
}

// O si quieres usar el patrón existente
{
  path: "/legal/blog-rules",
  element: <TermsView />  // Con type="blog-rules"
}
```

## 📝 Mantenimiento

### Actualización de Reglas
1. Modifica el contenido en la base de datos
2. El `updatedAt` se actualiza automáticamente
3. Los usuarios que ya aceptaron verán el modal nuevamente
4. Las nuevas reglas entran en vigor inmediatamente

### Monitoreo
- Logs de errores en la consola si falla la carga
- Estados de loading visibles para el usuario
- Fallback a reglas por defecto en caso de error

## 🛡️ Seguridad y Privacidad

### RGPD Compliance
- ✅ Información clara sobre derechos del usuario
- ✅ Contactos específicos para ejercer derechos
- ✅ Plazos de respuesta definidos (30 días)
- ✅ Referencia a la autoridad de control (AEPD)

### Protección de Menores
- ✅ Normas específicas para entorno educativo
- ✅ Moderación adicional
- ✅ Contenido apropiado para menores

### Datos Almacenados
- `localStorage`: Fecha de aceptación de reglas
- Limpieza automática si las reglas se actualizan
- No se almacenan datos sensibles localmente

## 🐛 Troubleshooting

### Problemas Comunes

1. **Modal no aparece:**
   - Verificar que `autoShowOnMount` esté en `true`
   - Comprobar que no hay reglas ya aceptadas en localStorage

2. **Reglas no cargan:**
   - Verificar conexión con el backend
   - Comprobar que existe el tipo 'blog-rules' en la base de datos
   - Ver logs de consola para errores

3. **Estilos no aplicados:**
   - Verificar importación de archivos .scss
   - Comprobar que no hay conflictos de CSS

### Logs Útiles
```javascript
// En la consola del navegador
localStorage.getItem('rulesAccepted')
localStorage.getItem('rulesAcceptedDate')

// Para resetear durante desarrollo
localStorage.removeItem('rulesAccepted')
localStorage.removeItem('rulesAcceptedDate')
```

## 📋 Checklist de Implementación

- [x] ✅ Componente BlogRules con carga dinámica
- [x] ✅ Modal de aceptación en registro
- [x] ✅ Hook useRulesAcceptance
- [x] ✅ Integración con RegisterForm
- [x] ✅ Estilos responsive
- [x] ✅ Script SQL para base de datos
- [x] ✅ Vista independiente BlogRulesView
- [x] ✅ Gestión de errores y fallbacks
- [x] ✅ Cumplimiento RGPD
- [x] ✅ Verificación de actualizaciones
- [x] ✅ Documentación completa

El sistema está completo y listo para producción! 🎉
