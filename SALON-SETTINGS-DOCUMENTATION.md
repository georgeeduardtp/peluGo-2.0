# Panel de Configuración de Peluquería - Documentación

## 📋 Descripción General

El **Panel de Configuración de Peluquería** es una funcionalidad completa que permite a las peluquerías aprobadas modificar toda la información de su perfil directamente desde una interfaz moderna y fácil de usar.

## 🎯 Funcionalidades Principales

### ✅ Acceso Controlado
- **Solo peluquerías aprobadas** pueden acceder al panel
- Verificación automática del estado de aprobación
- Redirección automática si no está autorizado

### ✅ Carga Automática de Datos
- Carga todos los datos actuales del perfil
- Rellena automáticamente todos los campos del formulario
- Muestra horarios y servicios configurados

### ✅ Edición Completa
- **Información del Negocio**:
  - Nombre de la peluquería
  - Dirección completa
  - Ciudad
  - Teléfono
  - Sitio web (opcional)

- **Información Adicional**:
  - Descripción de la peluquería
  - Servicios ofrecidos (múltiple selección)

- **Horario de Atención**:
  - Configuración individual por día
  - Horarios de apertura y cierre
  - Configuración de descansos
  - Botones de configuración rápida

## 🛠️ Archivos Implementados

### 1. `salon-settings.html`
**Descripción**: Página principal del panel de configuración
**Características**:
- Interfaz moderna con diseño responsive
- Formulario completo con validación
- Configuración avanzada de horarios
- Botones de configuración rápida

### 2. `assets/js/salon-settings.js`
**Descripción**: Lógica JavaScript del panel
**Funcionalidades**:
- Verificación de acceso
- Carga de datos del perfil
- Validación de formularios
- Guardado en Firebase
- Gestión de horarios

### 3. Actualizaciones en `assets/js/main.js`
**Descripción**: Integración con el menú principal
**Cambios**:
- Agregado enlace "Configuración" en el menú de peluquerías aprobadas
- Disponible tanto en menú desktop como móvil

## 🔐 Sistema de Acceso

### Verificación de Permisos
```javascript
// Solo peluquerías aprobadas pueden acceder
if (salonData.approved !== true) {
    showAccessDenied();
    return;
}
```

### Estados de Acceso
- **✅ Aprobada**: Acceso completo al panel
- **❌ Pendiente**: Redirige a `salon-waiting.html`
- **❌ Incompleta**: Redirige a `complete-profile.html`
- **❌ No autorizada**: Muestra pantalla de acceso denegado

## 📝 Campos Editables

### Información Básica
| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| Nombre de la peluquería | Texto | ✅ | Requerido |
| Dirección | Texto | ✅ | Requerido |
| Ciudad | Select | ✅ | Requerido |
| Teléfono | Teléfono | ✅ | Formato válido |
| Sitio web | URL | ❌ | Formato URL válido |

### Información Adicional
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| Descripción | Textarea | ❌ | Descripción pública |
| Servicios | Checkbox | ✅ | Múltiple selección |

### Servicios Disponibles
- ✅ Corte
- ✅ Peinado
- ✅ Tinte
- ✅ Mechas
- ✅ Tratamientos
- ✅ Barbería

## ⏰ Sistema de Horarios

### Configuración por Día
- **Lunes a Domingo**: Configuración individual
- **Horarios**: Apertura y cierre personalizables
- **Descansos**: Configuración opcional de descansos

### Botones de Configuración Rápida
1. **Horario Estándar**: L-V 9:00-19:00
2. **Horario Extendido**: L-V 8:00-20:00
3. **Incluir Fines**: L-V 9:00-19:00, S 10:00-18:00
4. **Limpiar Todo**: Marcar todos los días como cerrados

### Estructura de Datos
```javascript
schedule: {
    monday: {
        open: "09:00",
        close: "19:00",
        break: true,
        breakStart: "13:00",
        breakEnd: "14:00"
    },
    tuesday: { closed: true },
    // ... resto de días
}
```

## 🔄 Flujo de Trabajo

### 1. Acceso al Panel
```
Usuario logueado → Verificar rol → Verificar aprobación → Cargar datos → Mostrar formulario
```

### 2. Edición de Datos
```
Cargar datos actuales → Rellenar formulario → Usuario edita → Validar → Guardar
```

### 3. Guardado
```
Validar formulario → Preparar datos → Actualizar Firebase → Mostrar confirmación → Actualizar UI
```

## ✅ Validaciones Implementadas

### Campos Obligatorios
- Nombre de la peluquería
- Dirección
- Ciudad
- Teléfono
- Al menos un servicio

### Validaciones de Formato
- **Teléfono**: Formato internacional válido
- **URL**: Formato de sitio web válido
- **Horarios**: Horarios lógicos (apertura < cierre)

## 🎨 Interfaz de Usuario

### Diseño Responsive
- **Desktop**: Layout de 2 columnas
- **Tablet**: Layout adaptativo
- **Móvil**: Layout de 1 columna

### Elementos Visuales
- **Iconos**: Font Awesome para mejor UX
- **Colores**: Esquema consistente con la app
- **Animaciones**: Transiciones suaves
- **Notificaciones**: Sistema de alertas

### Estados de Interfaz
- **Cargando**: Pantalla de carga con spinner
- **Acceso Denegado**: Pantalla de error
- **Éxito**: Notificación verde
- **Error**: Notificación roja

## 🔧 Integración con Firebase

### Actualización de Datos
```javascript
// Actualizar perfil en Firebase
await window.FirebaseAPI.updateSalonProfile(currentUser.uid, updateData);
```

### Campos Actualizados
- `businessName`
- `address`
- `city`
- `phone`
- `description`
- `services`
- `schedule`
- `website`
- `lastUpdated`

## 📱 Navegación

### Menú Principal
- **Desktop**: Dropdown en el menú de usuario
- **Móvil**: Opción en el menú hamburguesa
- **Estado**: Solo visible para peluquerías aprobadas

### Enlaces de Navegación
- **Configuración**: `salon-settings.html`
- **Volver al Inicio**: `index.html`
- **Cerrar Sesión**: Logout y redirige a `index.html`

## 🧪 Archivos de Prueba

### `test-salon-settings.html`
**Descripción**: Página de prueba para verificar funcionalidades
**Contenido**:
- Lista de funcionalidades implementadas
- Campos editables disponibles
- Características del sistema de horarios
- Botones de acceso directo

## 🚀 Próximas Mejoras

### Funcionalidades Futuras
1. **Cambio de Contraseña**: Panel de seguridad
2. **Configuración de Notificaciones**: Preferencias de alertas
3. **Subida de Imágenes**: Galería de fotos del negocio
4. **Configuración de Precios**: Gestión de tarifas
5. **Horarios Especiales**: Días festivos y excepciones

### Optimizaciones Técnicas
1. **Caché Local**: Almacenamiento temporal de datos
2. **Validación en Tiempo Real**: Feedback inmediato
3. **Auto-guardado**: Guardado automático de cambios
4. **Historial de Cambios**: Registro de modificaciones

## 📞 Soporte

### Problemas Comunes
1. **No puedo acceder**: Verificar estado de aprobación
2. **No se guardan los cambios**: Verificar conexión a Firebase
3. **Horarios no se cargan**: Verificar formato de datos

### Contacto
Para soporte técnico o reportar problemas, contactar al equipo de desarrollo.

---

**Versión**: 1.0  
**Fecha**: Diciembre 2024  
**Autor**: Equipo PeluGo 2.0 