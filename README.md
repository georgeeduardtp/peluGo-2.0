# peluGo-2.0

🚀 **La nueva generación de la plataforma líder de peluquerías en España**

Una aplicación web moderna que conecta usuarios con las mejores peluquerías de España, con un diseño renovado, mejores funcionalidades y experiencia de usuario optimizada.

## 🌟 Características principales

### ✅ **Implementado en v2.0**
- **🎨 Diseño moderno** con Tailwind CSS
- **📱 PWA (Progressive Web App)** instalable
- **🔍 Búsqueda avanzada** por ciudad y filtros
- **⭐ Sistema de valoraciones** con estrellas
- **📋 Peluquerías destacadas** con información completa
- **🏷️ Categorización** por servicios (Corte, Barbería, Color, Tratamientos)
- **📱 Responsive design** móvil-first
- **🎭 Animaciones suaves** y transiciones
- **♿ Accesibilidad** mejorada

### ✅ **Implementado en v2.0**
- **🔥 Firebase integrado** - Autenticación y base de datos
- **👥 Sistema de usuarios** - Admin, Usuario, Peluquería
- **🔐 Autenticación completa** - Login/registro con validación
- **📋 Gestión de roles** - Permisos por tipo de usuario
- **⚡ Actualizaciones en tiempo real** - Cambios automáticos
- **🛡️ Seguridad** - Reglas de Firebase y validaciones

### 🚧 **Próximas funcionalidades**
- Sistema completo de reservas online
- Panel de administración avanzado  
- Sistema de pagos integrado
- Chat en tiempo real
- Notificaciones push
- Geolocalización

## 🛠️ Stack tecnológico

```
Frontend: HTML5 + CSS3 + JavaScript ES6+ + Tailwind CSS
Backend: Firebase (Firestore, Auth, Storage, Hosting)
Database: Firestore (NoSQL) con colecciones users, salons, admins
Authentication: Firebase Auth con roles personalizados
PWA: Service Workers + Web App Manifest
Security: Firebase Security Rules + validaciones frontend
```

## 📁 Estructura del proyecto

```
peluGo-2.0/
├── index.html                      # Página principal
├── auth.html                       # Sistema de login/registro
├── manifest.json                   # Configuración PWA
├── firebase-setup.md              # Guía de configuración Firebase
├── README.md                      # Documentación del proyecto
├── assets/
│   ├── css/
│   │   └── styles.css             # Estilos personalizados
│   ├── js/
│   │   ├── main.js                # JavaScript principal
│   │   ├── auth.js                # Sistema de autenticación
│   │   └── firebase-integration.js # Integración con Firebase
│   ├── data/
│   │   └── salons.json            # Estructura de datos (ahora vacía)
│   └── images/                    # Recursos gráficos
└── components/                    # Componentes futuros
```

## 🚀 Instalación y uso

### Configuración Firebase (REQUERIDA)
1. **Lee `firebase-setup.md`** - Guía completa paso a paso
2. **Crea proyecto Firebase** en https://console.firebase.google.com
3. **Configura Authentication y Firestore**
4. **Actualiza `firebase-integration.js`** con tus credenciales
5. **Configura reglas de seguridad** según la guía

### Desarrollo local
1. Clona el repositorio
2. Configura Firebase (paso anterior)
3. Abre `index.html` en tu navegador
4. Ve a `auth.html` para registrar usuarios

### Para producción
1. Completa configuración Firebase
2. Sube archivos a tu servidor web (HTTPS requerido)
3. Configura dominio en Firebase Console
4. ¡Tu app estará lista con base de datos real!

## 📱 PWA - Aplicación web progresiva

La aplicación puede instalarse como una app nativa:
- **📲 Instalable** en móviles y escritorio
- **⚡ Carga rápida** con Service Workers
- **📶 Funciona offline** (funcionalidad básica)
- **🔔 Notificaciones push** (próximamente)

## 🎯 Mejoras vs versión anterior

| Aspecto | Versión 1.0 | Versión 2.0 |
|---------|-------------|-------------|
| **Diseño** | Básico, problema "Cargando..." | Moderno, Tailwind CSS, sin problemas de carga |
| **UX/UI** | Interfaz simple | Animaciones, micro-interacciones, responsive |
| **Autenticación** | No existía | Firebase Auth completo con 3 tipos de usuarios |
| **Base de datos** | No existía | Firestore con tiempo real y reglas de seguridad |
| **Funciones** | Búsqueda básica | Sistema completo de usuarios, roles y permisos |
| **Performance** | Lenta | Optimizada, PWA, actualizaciones en tiempo real |
| **Mobile** | Básico | Mobile-first, PWA instalable |
| **Seguridad** | No existía | Firebase Security Rules + validaciones |

## 🧩 Componentes principales

### 1. **Navigation Bar**
- Logo con gradiente PeluGo
- Menú responsive con hamburger
- Enlaces de registro y login

### 2. **Hero Section**
- Título llamativo con gradientes
- Buscador principal con geolocalización
- Estadísticas de la plataforma

### 3. **Peluquerías Destacadas**
- Grid responsive de cards
- Filtros por ciudad
- Sistema de estrellas
- Botones de reserva

### 4. **Categorías**
- 4 categorías principales con iconos
- Hover effects y animaciones
- Enlaces a páginas específicas

### 5. **PWA Section**
- Promoción de la aplicación
- Beneficios (velocidad, offline, notificaciones)
- Botón de instalación

### 6. **Footer**
- Enlaces organizados por secciones
- Newsletter subscription
- Redes sociales
- Información legal

## 🎨 Diseño y branding

### Paleta de colores
```css
Primario: Purple (#8b5cf6) a Pink (#ec4899)
Secundario: Gray scale (#f9fafb a #1f2937)
Acentos: Yellow (#fbbf24) para estrellas
```

### Tipografía
- **Principal**: System fonts optimizadas
- **Tamaños**: Responsive con rem
- **Pesos**: Regular (400) a Bold (700)

### Gradientes
```css
/* Gradiente principal */
background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);

/* Gradiente de texto */
background: linear-gradient(to right, #8b5cf6, #ec4899);
```

## 📊 Datos y estructura

### Formato de peluquerías
```json
{
  "id": 1,
  "name": "Nombre de la peluquería",
  "city": "Ciudad",
  "rating": 4.8,
  "reviewCount": 124,
  "services": ["Corte", "Color", "Peinado"],
  "price": "Desde 25€",
  "featured": true,
  "verified": true
}
```

## 🔧 Configuración avanzada

### Firebase setup (próximo)
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "pelugo-2024.firebaseapp.com",
  projectId: "pelugo-2024",
  // ... más configuración
};
```

### Variables de entorno
```
FIREBASE_API_KEY=tu_api_key
FIREBASE_PROJECT_ID=pelugo-2024
MAPS_API_KEY=tu_maps_key
```

## 🚀 Roadmap 2024

### Q1 2024
- [x] Nuevo diseño y estructura
- [x] PWA básica
- [ ] Sistema de reservas
- [ ] Autenticación Firebase

### Q2 2024
- [ ] Panel de administración
- [ ] Sistema de pagos
- [ ] App móvil nativa (React Native)

### Q3 2024
- [ ] IA para recomendaciones
- [ ] Chat bot integrado
- [ ] Analytics avanzado

## 👥 Contribución

Este es un proyecto privado para PeluGo. Para contribuir:
1. Crea una rama feature
2. Haz tus cambios
3. Crea un pull request
4. Espera revisión

## 📄 Licencia

© 2025 PeluGo. Todos los derechos reservados.

---

**🔗 Enlaces útiles:**
- [pelugo.es](https://pelugo.es) - Versión actual
- [Firebase](https://firebase.google.com) - Backend
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [PWA Guide](https://web.dev/progressive-web-apps/) - Documentación PWA