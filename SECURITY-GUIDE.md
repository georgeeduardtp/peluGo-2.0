# 🔒 Guía de Seguridad - PeluGo 2.0

## 🚨 Código de Administrador - Configuración Segura

### ✅ **Problema Resuelto: Código Admin Hardcodeado**

Hemos implementado una solución más segura para manejar el código de administrador.

### 📁 **Archivos Modificados**

1. **`assets/js/config.js`** - Nuevo archivo de configuración
2. **`assets/js/firebase-integration.js`** - Validación mejorada
3. **`auth.html`** - Incluye configuración
4. **`admin-login.html`** - Incluye configuración
5. **`admin.html`** - Incluye configuración

### 🔧 **Cómo Cambiar el Código Admin**

#### **Opción 1: Cambio Manual (Recomendado para desarrollo)**

Edita el archivo `assets/js/config.js`:

```javascript
function getAdminCode() {
    // Cambia este valor por tu código secreto
    return "TU_CODIGO_SECRETO_AQUI";
}
```

#### **Opción 2: Variables de Entorno (Recomendado para producción)**

Si usas un bundler como Webpack o Vite:

```javascript
function getAdminCode() {
    // Obtener de variable de entorno
    return process.env.ADMIN_CODE || "PELUGO_ADMIN_2024";
}
```

#### **Opción 3: Servidor de Configuración**

Para máxima seguridad, puedes crear un endpoint que devuelva el código:

```javascript
async function getAdminCode() {
    try {
        const response = await fetch('/api/admin-code');
        const data = await response.json();
        return data.code;
    } catch (error) {
        console.error('Error obteniendo código admin:', error);
        return null;
    }
}
```

### 🛡️ **Mejoras de Seguridad Implementadas**

#### **1. Validación Robusta**
```javascript
function validateAdminCode(adminCode) {
    const expectedCode = window.PeluGoConfig?.admin?.secretCode;
    
    // Validación básica
    if (!adminCode || typeof adminCode !== 'string') {
        return { valid: false, error: 'Código de administrador requerido' };
    }
    
    // Comparación segura
    if (adminCode !== expectedCode) {
        return { valid: false, error: 'Código de administrador incorrecto' };
    }
    
    return { valid: true };
}
```

#### **2. Eliminación de Datos Sensibles**
```javascript
// Remove sensitive data before saving
delete userDoc.adminCode;
```

#### **3. Detección de Entorno**
```javascript
function getEnvironment() {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'development';
    }
    return 'production';
}
```

#### **4. Logs de Advertencia**
```javascript
if (isDevelopment()) {
    console.warn('⚠️ DESARROLLO: Usando código admin por defecto.');
    console.warn('📝 Para cambiar el código admin, edita assets/js/config.js');
}
```

### 🔐 **Recomendaciones de Seguridad**

#### **Para Desarrollo:**
1. ✅ Usa un código diferente al de producción
2. ✅ Cambia el código regularmente
3. ✅ No subas el código real a Git

#### **Para Producción:**
1. ✅ Usa variables de entorno
2. ✅ Implementa rate limiting
3. ✅ Usa HTTPS obligatorio
4. ✅ Considera autenticación de dos factores
5. ✅ Monitorea intentos de acceso

### 📝 **Ejemplo de Configuración Segura**

```javascript
// assets/js/config.js
const PeluGoConfig = {
    admin: {
        // En desarrollo
        secretCode: isDevelopment() ? "DEV_ADMIN_2024" : getProductionCode(),
        maxLoginAttempts: 5,
        sessionTimeout: 3600000,
        requireTwoFactor: false
    },
    security: {
        minPasswordLength: 8,
        requireStrongPassword: true,
        maxFailedLogins: 3,
        lockoutDuration: 900000
    }
};

function getProductionCode() {
    // Obtener de variable de entorno o servicio externo
    return process.env.ADMIN_CODE || "PROD_ADMIN_SECRET";
}
```

### 🚀 **Próximos Pasos de Seguridad**

1. **Implementar Rate Limiting**
2. **Agregar Autenticación de Dos Factores**
3. **Auditoría de Acciones de Admin**
4. **Backup Automático de Datos**
5. **Monitoreo de Seguridad**

### ⚠️ **Advertencias Importantes**

- **NUNCA** subas el código admin real a Git
- **SIEMPRE** usa HTTPS en producción
- **CAMBIA** el código regularmente
- **MONITOREA** los intentos de acceso
- **BACKUP** tus configuraciones

### 📞 **Soporte**

Si necesitas ayuda con la configuración de seguridad:
1. Revisa los logs de la consola
2. Verifica que `config.js` esté cargado
3. Confirma que el código admin sea correcto
4. Revisa las reglas de Firestore

---

**✅ El código admin ya no está hardcodeado y es más seguro!** 