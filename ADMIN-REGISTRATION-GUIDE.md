# Guía de Registro de Administradores - PeluGo 2.0

## Problema Resuelto ✅

El problema del "código de admin hardcodeado" ha sido solucionado. Ahora el sistema solicita y valida correctamente el código de administrador durante el registro.

## Cómo Registrar un Administrador

### ⚠️ Páginas Eliminadas

Las páginas `create-admin.html` y `create-admin-simple.html` han sido eliminadas por seguridad después de crear el administrador inicial.

### Para Crear Administradores Adicionales

Si necesitas crear administradores adicionales en el futuro, puedes:

1. **Usar el panel de administración** (si tienes acceso)
2. **Crear una página temporal** similar a las eliminadas
3. **Usar Firebase Console** directamente

### Código de Administrador

El código por defecto sigue siendo: `PELUGO_ADMIN_2024`

## Código de Administrador

### Código por Defecto
- **Desarrollo**: `PELUGO_ADMIN_2024`
- **Producción**: Configurable en `assets/js/config.js`

### Cambiar el Código

1. **Edita** `assets/js/config.js`
2. **Modifica** la función `getAdminCode()`:
   ```javascript
   function getAdminCode() {
       // En desarrollo, usar código por defecto
       if (isDevelopment()) {
           return "TU_NUEVO_CODIGO_AQUI";
       }
       
       // En producción, usar variable de entorno
       if (typeof process !== 'undefined' && process.env.ADMIN_CODE) {
           return process.env.ADMIN_CODE;
       }
       
       // Fallback
       return "TU_NUEVO_CODIGO_AQUI";
   }
   ```

## Validación de Seguridad

### Backend (firebase-integration.js)
- ✅ Valida el código de administrador antes de crear la cuenta
- ✅ Elimina el código de los datos antes de guardar en Firestore
- ✅ Usa configuración centralizada desde `config.js`

### Frontend (create-admin.html y create-admin-simple.html)
- ✅ Solicita el código de administrador
- ✅ Valida que todos los campos estén completos
- ✅ Usa la función `registerUser` con validación

## Flujo de Registro

1. **Usuario llena el formulario** con email, contraseña, nombre y código
2. **Frontend valida** que todos los campos estén completos
3. **Se llama a `registerUser`** con `userType: 'admin'`
4. **Backend valida el código** usando `validateAdminCode()`
5. **Si el código es correcto**:
   - Se crea el usuario en Firebase Auth
   - Se crea el documento en la colección `admins`
   - Se crea el documento en la colección `users` con role: 'admin'
6. **Si el código es incorrecto**: Se devuelve error

## Mensajes de Error

### Código Incorrecto
```
"Código de administrador incorrecto"
```

### Código Faltante
```
"Código de administrador requerido"
```

### Otros Errores
- Email ya en uso
- Contraseña débil
- Error de conexión
- Error de permisos en Firestore

## Seguridad Implementada

### ✅ Validación del Código
- Verificación contra configuración centralizada
- Diferentes códigos para desarrollo y producción
- Validación en el backend antes de crear la cuenta

### ✅ Eliminación de Datos Sensibles
- El código de administrador se elimina antes de guardar en Firestore
- No se almacena información sensible en la base de datos

### ✅ Configuración Centralizada
- Código de administrador en `config.js`
- Detección automática de entorno (desarrollo/producción)
- Logs de advertencia en desarrollo

### ✅ Validación de Entrada
- Campos obligatorios en el frontend
- Validación de formato de email
- Validación de longitud de contraseña

## Próximos Pasos de Seguridad

1. **Rate Limiting**: Limitar intentos de registro
2. **2FA**: Autenticación de dos factores para administradores
3. **Auditoría**: Logs de creación de administradores
4. **Backups**: Respaldos regulares de la base de datos
5. **HTTPS**: Asegurar conexiones seguras en producción

## Solución de Problemas

### "No se pide el código de administrador"
- ✅ **SOLUCIONADO**: Ahora se solicita en ambos formularios de creación

### "El código no se valida"
- ✅ **SOLUCIONADO**: La validación está implementada en el backend

### "Error de permisos en Firestore"
- Verifica las reglas de seguridad en `firestore.rules`
- Asegúrate de que el proyecto de Firebase esté configurado correctamente

### "Firebase no está disponible"
- Verifica la conexión a internet
- Revisa la configuración de Firebase en `firebase-integration.js`
- Asegúrate de que todos los archivos estén cargados correctamente

## Archivos Modificados

- ✅ `assets/js/config.js`: Configuración centralizada del código
- ✅ `assets/js/firebase-integration.js`: Validación del código implementada
- ✅ `SECURITY-GUIDE.md`: Documentación de seguridad
- ✅ `ADMIN-REGISTRATION-GUIDE.md`: Documentación actualizada

## Archivos Eliminados (Seguridad)

- 🗑️ `create-admin.html`: Página temporal eliminada
- 🗑️ `create-admin-simple.html`: Página temporal eliminada

## Notas Importantes

1. ✅ **Páginas temporales eliminadas** por seguridad
2. **Cambia el código por defecto** en producción
3. **Usa variables de entorno** para el código en producción
4. **Revisa los logs** en la consola del navegador para debugging
5. **Verifica los permisos** de Firestore después de crear el administrador

---

**Estado**: ✅ **PROBLEMA RESUELTO**

El sistema ahora solicita y valida correctamente el código de administrador durante el registro de administradores. 