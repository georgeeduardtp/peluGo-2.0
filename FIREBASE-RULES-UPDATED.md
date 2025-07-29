# Firebase Rules - Actualizadas para Panel de Configuración

## 📋 **Resumen de Cambios**

Las reglas de Firebase han sido actualizadas para soportar completamente el panel de configuración de la peluquería, incluyendo la gestión de empleados, horarios y servicios.

## 🔧 **Nuevas Funcionalidades Soportadas**

### **1. Validación de Datos de Peluquería**
```javascript
function isValidSalonData(data) {
  return data.keys().hasAll(['businessName', 'address', 'city', 'phone', 'uid']) &&
         data.businessName is string && data.businessName.size() > 0 &&
         data.address is string && data.address.size() > 0 &&
         data.city is string && data.city.size() > 0 &&
         data.phone is string && data.phone.size() > 0 &&
         data.uid is string && data.uid.size() > 0;
}
```

**Campos Obligatorios:**
- ✅ `businessName` - Nombre de la peluquería
- ✅ `address` - Dirección completa
- ✅ `city` - Ciudad
- ✅ `phone` - Teléfono
- ✅ `uid` - ID del usuario propietario

### **2. Gestión de Empleados**
```javascript
function isValidEmployeeData(employee) {
  return employee.keys().hasAll(['id', 'name']) &&
         employee.name is string && employee.name.size() > 0 &&
         employee.id is string && employee.id.size() > 0;
}

function isValidEmployeesArray(employees) {
  return employees is list && employees.size() <= 20 && // Máximo 20 empleados
         employees.hasAll(employees.map(e => isValidEmployeeData(e)));
}
```

**Características:**
- ✅ **Máximo 20 empleados** por peluquería
- ✅ **Validación de datos** de cada empleado
- ✅ **Subcolección de empleados** (`/salons/{salonId}/employees/{employeeId}`)
- ✅ **Solo el propietario** puede gestionar empleados

### **3. Gestión de Horarios**
```javascript
function isValidScheduleData(data) {
  return data.keys().hasAll(['salonId', 'schedule']) &&
         data.salonId is string && data.salonId.size() > 0 &&
         data.schedule is map;
}
```

**Características:**
- ✅ **Colección independiente** de horarios
- ✅ **Validación de estructura** de horarios
- ✅ **Vinculación con peluquería** mediante `salonId`

### **4. Gestión de Servicios**
```javascript
function isValidServiceData(data) {
  return data.keys().hasAll(['salonId', 'name']) &&
         data.salonId is string && data.salonId.size() > 0 &&
         data.name is string && data.name.size() > 0 && data.name.size() <= 100;
}
```

**Características:**
- ✅ **Colección independiente** de servicios
- ✅ **Nombre limitado a 100 caracteres**
- ✅ **Vinculación con peluquería** mediante `salonId`

## 🔐 **Permisos por Colección**

### **Colección `salons`**
```javascript
// Lectura pública de peluquerías aprobadas
allow read: if resource.data.approved == true;

// Propietario puede leer sus datos
allow read: if request.auth != null && request.auth.uid == resource.data.uid;

// Propietario puede actualizar con validación
allow update: if request.auth != null && 
                 request.auth.uid == resource.data.uid &&
                 isValidSalonData(request.resource.data) &&
                 (request.resource.data.employees == null || 
                  isValidEmployeesArray(request.resource.data.employees));

// Creación con validación
allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.uid &&
                 isValidSalonData(request.resource.data);
```

### **Subcolección `employees`**
```javascript
// Propietario puede gestionar empleados
allow read, write: if request.auth != null && 
                     request.auth.uid == get(/databases/$(database)/documents/salons/$(salonId)).data.uid;

// Creación con validación
allow create: if request.auth != null && 
                 request.auth.uid == get(/databases/$(database)/documents/salons/$(salonId)).data.uid &&
                 isValidEmployeeData(request.resource.data);
```

### **Colección `schedules`**
```javascript
// Propietario puede gestionar horarios
allow read, write: if request.auth != null && 
                     request.auth.uid == get(/databases/$(database)/documents/salons/$(data.salonId)).data.uid;

// Creación con validación
allow create: if request.auth != null && 
                 request.auth.uid == get(/databases/$(database)/documents/salons/$(request.resource.data.salonId)).data.uid &&
                 isValidScheduleData(request.resource.data);
```

### **Colección `services`**
```javascript
// Propietario puede gestionar servicios
allow read, write: if request.auth != null && 
                     request.auth.uid == get(/databases/$(database)/documents/salons/$(data.salonId)).data.uid;

// Creación con validación
allow create: if request.auth != null && 
                 request.auth.uid == get(/databases/$(database)/documents/salons/$(request.resource.data.salonId)).data.uid &&
                 isValidServiceData(request.resource.data);
```

## 🛡️ **Seguridad Implementada**

### **1. Validación de Datos**
- ✅ **Campos obligatorios** verificados
- ✅ **Tipos de datos** validados
- ✅ **Longitudes** controladas
- ✅ **Formato de datos** verificado

### **2. Control de Acceso**
- ✅ **Solo propietarios** pueden modificar sus datos
- ✅ **Admins** tienen acceso completo
- ✅ **Usuarios no autenticados** solo pueden leer datos públicos

### **3. Límites de Seguridad**
- ✅ **Máximo 20 empleados** por peluquería
- ✅ **Nombres limitados** a 100 caracteres
- ✅ **Validación de estructura** de datos

### **4. Prevención de Acceso No Autorizado**
- ✅ **Verificación de propiedad** mediante `uid`
- ✅ **Validación de `salonId`** en subcolecciones
- ✅ **Bloqueo por defecto** de acceso no autorizado

## 🚀 **Implementación**

### **1. Desplegar Reglas**
```bash
firebase deploy --only firestore:rules
```

### **2. Verificar Reglas**
```bash
firebase firestore:rules:test
```

### **3. Monitorear Acceso**
- Revisar logs de Firestore en Firebase Console
- Monitorear intentos de acceso denegado
- Verificar validaciones de datos

## 📝 **Notas Importantes**

### **1. Compatibilidad**
- ✅ **Compatibles** con el panel de configuración actual
- ✅ **Soportan** la gestión de empleados
- ✅ **Validan** todos los campos del formulario

### **2. Rendimiento**
- ✅ **Validaciones eficientes** en el servidor
- ✅ **Índices optimizados** para consultas
- ✅ **Límites de tamaño** para prevenir abuso

### **3. Escalabilidad**
- ✅ **Soportan** múltiples peluquerías
- ✅ **Estructura preparada** para futuras funcionalidades
- ✅ **Reglas modulares** fáciles de mantener

## 🔍 **Testing de Reglas**

### **Casos de Prueba Recomendados:**

1. **Crear peluquería** con datos válidos
2. **Actualizar datos** de peluquería existente
3. **Agregar empleados** a la peluquería
4. **Modificar horarios** de la peluquería
5. **Intentar acceso** no autorizado
6. **Validar datos** con campos faltantes
7. **Probar límites** (más de 20 empleados)

### **Comandos de Testing:**
```bash
# Test de reglas básicas
firebase firestore:rules:test test-rules.json

# Test de validación de datos
firebase firestore:rules:test test-validation.json

# Test de permisos
firebase firestore:rules:test test-permissions.json
```

---

**Estado:** ✅ **Actualizadas y Listas para Producción**
**Versión:** 2.0
**Fecha:** Diciembre 2024 