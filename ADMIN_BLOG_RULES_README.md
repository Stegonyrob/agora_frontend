# 📋 Sistema de Administración de Reglas de Blog - Ágora

## 🎯 Características Implementadas

### ✅ **Editor WYSIWYG Completo**
- **TinyMCE integrado** - Editor rich text profesional
- **Vista previa en tiempo real** - Alterna entre edición y preview
- **Interfaz intuitiva** - Diseño moderno y fácil de usar
- **Editor con herramientas completas** - Formato de texto, listas, enlaces, etc.
- **Responsive** - Funciona en dispositivos móviles y desktop

### ✅ **Panel de Administración**
- **Nuevo ítem en menú admin**: "Reglas Blog" y "Reglas Blog (Vista Usuario)"  
- **Vista de administración completa** - Gestión centralizada
- **Estado en tiempo real** - Ve cuándo se actualizó por última vez
- **Panel de control visual** - Botones claros para crear/editar
- **Vista previa integrada** - Ve exactamente cómo verán los usuarios

### ✅ **Gestión de Datos Inteligente**
- **Crear nuevas reglas** - Si no existen, crea automáticamente
- **Actualizar reglas existentes** - Modifica las reglas actuales
- **Persistencia en base de datos** - Guardado automático
- **Sincronización inmediata** - Los usuarios ven cambios al instante
- **Manejo de errores robusto** - Fallbacks y mensajes claros

## 🛠️ Componentes Creados

### 1. **BlogRulesEditor.tsx**
```typescript
// Editor modal completo con TinyMCE
interface BlogRulesEditorProps {
  show: boolean;
  onHide: () => void;
  onSave?: (updatedRules: LegalTextDTO) => void;
}
```

**Características:**
- 📝 Editor TinyMCE con toolbar completa
- 👁️ Modo vista previa
- 💾 Guardado automático con validación
- 🎨 Interfaz moderna y atractiva
- 📱 Responsive para móviles

### 2. **AdminBlogRulesView.tsx**
```typescript
// Vista principal de administración
const AdminBlogRulesView: React.FC = () => {
  // Gestión completa del estado
  // Carga, edición y preview de reglas
}
```

**Características:**
- 🎛️ Panel de control centralizado
- 📊 Estado de última actualización
- ⚠️ Mensajes de error informativos
- 💡 Consejos de uso para el admin
- 🔄 Recarga automática tras guardar

### 3. **Estilos Modulares**
- `BlogRulesEditor.module.scss` - Estilos del editor
- `AdminBlogRulesView.module.scss` - Estilos de la vista admin
- **Diseño moderno**: Gradientes, sombras, animaciones
- **Accesibilidad**: Colores contrastados, navegación clara

## 🔄 Flujo de Trabajo

### **Para el Administrador:**

1. **Acceder al Dashboard**
   ```
   /admin → Panel Admin → "Reglas Blog"
   ```

2. **Crear/Editar Reglas**
   - Haz clic en "Crear Reglas" o "Editar Reglas"
   - Se abre el editor modal con TinyMCE
   - Edita título y contenido con formato rico
   - Usa "Vista Previa" para ver cómo se verá

3. **Guardar Cambios**
   - Valida que título y contenido no estén vacíos
   - Guarda automáticamente en base de datos
   - Actualiza `updatedAt` para control de versiones
   - Los usuarios existentes deberán aceptar nuevas reglas

4. **Vista Usuario**
   - Haz clic en "Reglas Blog (Vista Usuario)"
   - Ve exactamente lo mismo que ven los usuarios

### **Para los Usuarios:**
- ✅ Las reglas actualizadas aparecen **inmediatamente**
- ✅ Modal de aceptación si las reglas cambiaron
- ✅ Sistema automático sin intervención manual

## 🎨 Características del Editor TinyMCE

### **Herramientas Disponibles:**
- ✏️ **Formato de texto**: Bold, italic, underline, strikethrough
- 📝 **Párrafos**: H1, H2, H3, párrafos normales
- 📋 **Listas**: Viñetas y numeradas con indentación
- 🔗 **Enlaces**: Insertar y editar enlaces
- ⚙️ **Herramientas**: Deshacer, rehacer, limpiar formato
- 🎯 **Alineación**: Izquierda, centro, derecha, justificado

### **Configuración Especial:**
```javascript
// Configuración optimizada para reglas legales
{
  height: 500,
  language: 'es',
  branding: false,
  plugins: ['advlist', 'autolink', 'lists', 'link', ...]
  toolbar: 'undo redo | blocks | bold italic...'
}
```

## 📁 Archivos Modificados/Creados

### **Nuevos Componentes:**
```
src/assets/Components/Legal/
├── BlogRulesEditor.tsx ✨ NUEVO
└── BlogRulesEditor.module.scss ✨ NUEVO

src/assets/Views/
├── AdminBlogRulesView.tsx ✨ NUEVO
└── AdminBlogRulesView.module.scss ✨ NUEVO
```

### **Archivos Modificados:**
```
src/assets/Components/Blog/admin/dashboard/
└── AdminDashboardMenu.tsx ✅ ACTUALIZADO (+2 ítems menú)

src/App.tsx ✅ ACTUALIZADO (+ruta /admin/blog-rules)

package.json ✅ ACTUALIZADO (+@tinymce/tinymce-react)
```

## 🚀 Cómo Usar

### **1. Acceso Rápido**
```
Dashboard Admin → "Reglas Blog" → Modal Editor
```

### **2. Workflow Típico**
1. Abrir editor
2. Modificar título si es necesario
3. Editar contenido con herramientas de formato
4. Usar "Vista Previa" para verificar
5. Guardar → ¡Listo! Los usuarios lo ven al instante

### **3. Mejores Prácticas**
- ✅ **Títulos descriptivos**: "Reglas de la Comunidad Ágora"
- ✅ **Estructura clara**: Usa H2, H3 para organizar secciones
- ✅ **Listas para reglas**: Más fácil de leer
- ✅ **RGPD obligatorio**: Siempre incluir derechos de usuario
- ✅ **Información de contacto**: Email y teléfono actualizados

## 🔧 Configuración Técnica

### **TinyMCE (Editor WYSIWYG)**
```bash
npm install @tinymce/tinymce-react
```

### **Rutas Configuradas**
```typescript
// En App.tsx
<Route path="/admin/blog-rules" element={
  <PrivateLayout>
    <ProtectedRoute element={<AdminBlogRulesView />} />
  </PrivateLayout>
} />
```

### **Menú Admin Actualizado**
```typescript
// En AdminDashboardMenu.tsx
{
  key: "reglas-blog-admin",
  label: "Reglas Blog", 
  path: "/admin/blog-rules",
  role: "ROLE_ADMIN"
},
{
  key: "reglas-blog-preview",
  label: "Reglas Blog (Vista Usuario)",
  path: "/reglas-comunidad",
  viewAsUser: true
}
```

## 💡 Consejos para el Administrador

### **📝 Estructura Recomendada**
```html
<h2>Bienvenido a la Comunidad Ágora</h2>
<p>Introducción...</p>

<h3>Normas de Convivencia</h3>
<ul>
  <li><strong>Respeto:</strong> Descripción...</li>
  <li><strong>Tolerancia:</strong> Descripción...</li>
</ul>

<h3>Protección de Datos - RGPD</h3>
<ul>
  <li>Derecho de acceso</li>
  <li>Derecho de rectificación</li>
  <li>Derecho de supresión</li>
</ul>

<h3>Contacto</h3>
<p>Email: <strong>contacto@agoraeducativo.es</strong></p>
<p>Teléfono: <strong>+34 693 54 59 93</strong></p>
```

### **🎯 Tips de Redacción**
- **Lenguaje claro** - Evita tecnicismos
- **Párrafos cortos** - Más fácil de leer
- **Negritas para destacar** - Puntos importantes
- **Listas organizadas** - Reglas numeradas/viñetas
- **Información de contacto actualizada** - Siempre al final

## 🛡️ Seguridad y Validación

### **✅ Validaciones Implementadas:**
- Título obligatorio (no vacío)
- Contenido obligatorio (no vacío)  
- Autenticación requerida (solo ROLE_ADMIN)
- Headers de autorización en requests
- Sanitización automática por TinyMCE

### **🔒 Permisos:**
- Solo administradores pueden editar
- Usuarios normales solo ven las reglas
- Rutas protegidas con ProtectedRoute

## 🚨 Troubleshooting

### **Problemas Comunes:**

1. **Editor no carga:**
   - Verificar que TinyMCE esté instalado
   - Check conexión a internet (CDN)

2. **No se guardan cambios:**
   - Verificar autenticación de admin
   - Check logs de consola para errores de backend

3. **Vista previa no actualiza:**
   - Refrescar el navegador
   - Verificar que el contenido se guardó

### **Logs Útiles:**
```javascript
// En consola del navegador
console.log('BlogRulesEditor mounted')
console.log('Saving rules:', updatedRules)
console.log('Rules saved successfully')
```

## 🎉 Beneficios del Sistema

### **Para el Centro Ágora:**
- ✅ **Flexibilidad total** - Cambiar reglas sin programador
- ✅ **Cumplimiento legal** - Actualizaciones inmediatas cuando cambie normativa
- ✅ **Control de versiones** - Historial de cambios automático
- ✅ **Experiencia profesional** - Editor de calidad empresarial

### **Para los Usuarios:**
- ✅ **Información actualizada** - Siempre las reglas más recientes
- ✅ **Interfaz clara** - Fácil de leer y entender
- ✅ **Transparencia** - Saben cuándo cambiaron las reglas
- ✅ **RGPD compliance** - Derechos claramente explicados

---

## 🚀 **¡El sistema está listo para usar!**

El administrador ya puede:
1. 🎛️ **Acceder al dashboard** → "Reglas Blog"
2. ✏️ **Crear/editar reglas** con editor profesional
3. 👁️ **Ver preview** de cómo lo verán usuarios  
4. 💾 **Guardar cambios** que se aplican inmediatamente
5. 🔄 **Actualizar cuando sea necesario** sin tocar código

**¡Ágora ahora tiene control total sobre sus reglas de comunidad!** 🎊
