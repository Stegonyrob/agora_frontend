# 🗺️ GUÍA COMPLETA: GOOGLE MAPS EMBED

## 📋 **EXPLICACIÓN DEL CÓDIGO QUE ENVIASTE**

### **🔍 Análisis del iframe:**
```html
<iframe loading="lazy" 
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11569.138177170998!2d-5.6938366!3d43.5381102!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc8f7ffc1312fdb25!2sADANSI!5e0!3m2!1ses!2ses!4v1469475080254" 
        width="100%" 
        height="650" 
        frameborder="0" 
        allowfullscreen="allowfullscreen">
</iframe>
```

### **🔑 DECODIFICACIÓN DE PARÁMETROS:**

| Parámetro | Valor | Significado |
|-----------|-------|-------------|
| `!2d-5.6938366` | Longitud | **-5.6938366** (Oeste de España) |
| `!3d43.5381102` | Latitud | **43.5381102** (Norte de España) |
| `!1s0x0%3A0xc8f7ffc1312fdb25` | Place ID | Identificador único de **ADANSI** |
| `!2sADANSI` | Nombre | **ADANSI** (nombre del lugar) |
| `!4f13.1` | Zoom | Nivel **13.1** (zoom medio) |
| `!3m2!1ses!2ses` | Idioma/Región | **Español/España** |
| `width="100%"` | Ancho | **Responsive** (100% del contenedor) |
| `height="650"` | Alto | **650 píxeles** |

### **📍 UBICACIÓN DETECTADA:**
- **Coordenadas:** 43.5381102, -5.6938366
- **Lugar:** **Gijón, Asturias** (¡tu zona!)
- **Empresa:** ADANSI
- **Proximidad a Ágora:** Muy cerca de tu ubicación en Calle Nicaragua

## 🚀 **CÓMO CREAR TU EMBED PARA ÁGORA**

### **Método 1: Obtener desde Google Maps (Recomendado)**

1. **Ve a [Google Maps](https://maps.google.com/)**
2. **Busca:** "Calle Nicaragua 16, Gijón"
3. **Verifica la ubicación** en el mapa
4. **Haz clic en "Compartir"** (botón a la izquierda)
5. **Selecciona "Incorporar un mapa"**
6. **Ajusta el tamaño** (Pequeño/Mediano/Grande/Personalizado)
7. **Copia el código HTML**

### **Método 2: URL Manual para Ágora**

```html
<!-- URL de embed para Ágora Centro Educativo -->
<iframe 
  loading="lazy"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.547!2d-5.6615!3d43.5321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f15.0!3m3!1m2!1s0x0%3A0x0!2z0KHQu9Cw0LLQsNC90LjQuSDQmtCw0LHQuNC90LXRgg!5e0!3m2!1ses!2ses"
  width="100%" 
  height="650" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

**📍 Coordenadas aproximadas para Ágora:**
- **Latitud:** 43.5321 (ajustada para Gijón Oeste)
- **Longitud:** -5.6615 (Calle Nicaragua área)

### **Método 3: Usando API Key (Más Control)**

```html
<iframe
  loading="lazy"
  src="https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=Calle+Nicaragua+16,Gijón,España&zoom=15&maptype=roadmap&language=es"
  width="100%"
  height="650"
  frameborder="0"
  allowfullscreen>
</iframe>
```

## 🎯 **IMPLEMENTACIÓN EN TU PROYECTO REACT**

### **Opción 1: Componente Simple (Tu Estilo)**

```tsx
import React from 'react';

const AgoraLocationMap = () => {
  return (
    <div className="agora-map-container">
      <div className="location-info">
        <h5>📍 Ágora Centro Educativo</h5>
        <p>Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias</p>
      </div>
      
      <iframe
        loading="lazy"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.547!2d-5.6615!3d43.5321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f15.0!3m3!1m2!1s0x0%3A0x0!2zQWdvcmEgQ2VudHJvIEVkdWNhdGl2bw!5e0!3m2!1ses!2ses"
        width="100%"
        height="650"
        style={{
          border: 0,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa de Ágora Centro Educativo"
      />
      
      <div className="map-actions">
        <button 
          className="btn btn-primary"
          onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Calle+Nicaragua+16,Gijón,España', '_blank')}
        >
          🗺️ Ver en Google Maps
        </button>
        <button 
          className="btn btn-success"
          onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Calle+Nicaragua+16,Gijón,España', '_blank')}
        >
          🧭 Cómo llegar
        </button>
      </div>
    </div>
  );
};

export default AgoraLocationMap;
```

### **Opción 2: Usando mis Componentes Avanzados**

```tsx
import GoogleMapsEmbed from '@/components/maps/GoogleMapsEmbed';

// En tu página "Nosotros"
<GoogleMapsEmbed
  address="Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España"
  centerName="Ágora Centro Educativo"
  showModeToggle={true}  // Permite alternar entre embed e interactivo
/>
```

## 🔧 **PERSONALIZACIÓN AVANZADA**

### **Parámetros de la URL de Embed:**

```
https://www.google.com/maps/embed/v1/place?
  key=TU_API_KEY
  &q=Calle+Nicaragua+16,Gijón,España    # Dirección a mostrar
  &zoom=15                              # Nivel de zoom (1-20)
  &maptype=roadmap                      # Tipo: roadmap, satellite, hybrid, terrain
  &language=es                          # Idioma de la interfaz
  &region=ES                            # Región para localización
```

### **Estilos CSS Recomendados:**

```css
.agora-map-container {
  max-width: 100%;
  margin: 20px auto;
}

.location-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  border-left: 4px solid #007bff;
}

.agora-map-container iframe {
  transition: box-shadow 0.3s ease;
}

.agora-map-container iframe:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-actions {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 0 0 8px 8px;
  text-align: center;
}

.map-actions .btn {
  margin: 0 5px;
  border-radius: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .agora-map-container iframe {
    height: 400px;
  }
  
  .map-actions .btn {
    display: block;
    width: 100%;
    margin: 5px 0;
  }
}
```

## 🎯 **INTEGRACIÓN EN TU SECCIÓN "NOSOTROS"**

### **Para el texto "Donde Estamos":**

```tsx
// En tu CardText o componente equivalente
{text.title === "Donde Estamos" && (
  <div className="location-map-section mt-4">
    <hr />
    <AgoraLocationMap />
  </div>
)}
```

### **O usando el componente avanzado:**

```tsx
import CardTextWithMaps from '@/assets/Components/Card/text/CardTextWithMaps';

// Reemplaza tu CardText actual por:
<CardTextWithMaps 
  category="nosotros" 
  showMaps={true}
/>
```

## 📊 **COMPARACIÓN DE MÉTODOS**

| Método | Pros | Contras | Recomendado Para |
|--------|------|---------|------------------|
| **Embed Simple** | ✅ Fácil<br>✅ Sin API key<br>✅ Funciona siempre | ❌ Sin funciones avanzadas<br>❌ No cálculo de rutas | Sitios simples |
| **API con JS** | ✅ Funciones avanzadas<br>✅ Rutas automáticas<br>✅ Interactivo | ❌ Requiere API key<br>❌ Más complejo | Sitios profesionales |
| **Híbrido** | ✅ Lo mejor de ambos<br>✅ Fallback automático | ❌ Más código | **👑 Recomendado** |

## 🚀 **IMPLEMENTACIÓN INMEDIATA**

### **Para usar HOY (método simple):**

1. **Ve a Google Maps** y busca "Calle Nicaragua 16, Gijón"
2. **Comparte → Incorporar mapa**
3. **Copia el iframe**
4. **Pégalo en tu componente**

### **Para funcionalidad avanzada:**

1. **Usa mi componente `GoogleMapsEmbed`**
2. **Configura la API key** (opcional)
3. **Disfruta de ambas funcionalidades**

---

## ✨ **RESULTADO FINAL**

Con cualquiera de estos métodos tendrás:

- 🗺️ **Mapa interactivo** de tu ubicación
- 📱 **Diseño responsive** para móviles
- 🧭 **Botones de navegación** a Google Maps
- 🎯 **Ubicación precisa** en Gijón
- ⚡ **Carga rápida** y optimizada

**¡Los padres podrán encontrar tu centro fácilmente! 📍✨**