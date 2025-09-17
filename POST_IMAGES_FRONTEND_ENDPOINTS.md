# Post Images - Endpoints Frontend

## 🔐 **IMPORTANTE: Todos los endpoints requieren autenticación JWT**

A diferencia de Event Images, los Post Images requieren autenticación para todos los endpoints de lectura.

## 📋 **Endpoints Correctos para Postman:**

### **1. Obtener todas las imágenes de un post:**
```
GET http://localhost:8080/api/v1/post-images/post/{postId}
```

**Ejemplo:**
```
GET http://localhost:8080/api/v1/post-images/post/1
GET http://localhost:8080/api/v1/post-images/post/2
```

**Headers requeridos:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### **2. Obtener imagen específica por ID:**
```
GET http://localhost:8080/api/v1/post-images/{id}
```

**Ejemplo:**
```
GET http://localhost:8080/api/v1/post-images/1
```

### **3. URLs de imágenes físicas (estas NO requieren auth):**
```
GET http://localhost:8080/temp_images/adolescentesGrupal.jpg
GET http://localhost:8080/temp_images/alumnosOrdenador.jpg
GET http://localhost:8080/temp_images/niñoCascos.jpg
GET http://localhost:8080/temp_images/niñoFichas.jpg
```

## 📊 **Respuesta Esperada:**

```json
[
  {
    "id": 1,
    "imageName": "adolescentesGrupal.jpg",
    "imagePath": "/temp_images/adolescentesGrupal.jpg",
    "postId": 1,
    "isMainImage": true
  },
  {
    "id": 2,
    "imageName": "alumnosOrdenador.jpg", 
    "imagePath": "/temp_images/alumnosOrdenador.jpg",
    "postId": 1,
    "isMainImage": false
  }
]
```

## 🔧 **Datos de Prueba Disponibles:**

Según la documentación del backend:

### **Post 1:**
- `adolescentesGrupal.jpg` (principal) - `/temp_images/adolescentesGrupal.jpg`
- `alumnosOrdenador.jpg` - `/temp_images/alumnosOrdenador.jpg`

### **Post 2:**
- `niñoCascos.jpg` (principal) - `/temp_images/niñoCascos.jpg`
- `niñoFichas.jpg` - `/temp_images/niñoFichas.jpg`

## ⚡ **Proceso Frontend:**

1. **Llamar API** con autenticación: `GET /api/v1/post-images/post/{postId}`
2. **Obtener `imagePath`** del response JSON
3. **Construir URL física**: `http://localhost:8080${imagePath}`
4. **Mostrar imagen** directamente (sin auth adicional)

## 🔄 **Comparación con Event Images:**

| Aspecto | Event Images | Post Images |
|---------|--------------|-------------|
| **Auth GET** | ❌ Público | ✅ Requiere JWT |
| **Campo especial** | ❌ No | ✅ `isMainImage` |
| **URL pattern** | `/event-images` | `/post-images` |
| **Imágenes físicas** | 🟢 Sin auth | 🟢 Sin auth |

## 🚨 **Errores Comunes:**

1. **401 Unauthorized**: Falta JWT token en headers
2. **403 Forbidden**: Token expirado o inválido
3. **404 Not Found**: Post ID inexistente
4. **CORS**: Las imágenes físicas NO deben tener CORS al acceder directamente

## 🧪 **Testing en PostImageService:**

El `PostImageService` ahora:
- ✅ Usa `imagePath` directamente sin verificación CORS
- ✅ Construye URLs como: `http://localhost:8080/temp_images/imagen.jpg`
- ✅ Fallback a blob URLs legacy solo si falla `imagePath`
- ✅ Mantiene autenticación para endpoints API
