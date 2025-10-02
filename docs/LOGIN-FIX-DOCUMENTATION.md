# Fix del Bucle de Login y Aprobación - PeluGo 2.0

## Problema Identificado

Se detectó un bucle infinito de redirección cuando una peluquería ya verificada intentaba iniciar sesión. El problema ocurría porque:

1. **Inconsistencia en la verificación de roles**: Había dos funciones `getUserRole` diferentes con lógicas distintas
2. **Verificación incorrecta del estado de aprobación**: No se verificaba correctamente el campo `approved: true`
3. **Lógica de redirección confusa**: Las páginas de espera y completar perfil no manejaban correctamente el caso de peluquerías ya verificadas
4. **🆕 BUCLE INFINITO**: La función `updateUIForLoggedUser` en `main.js` causaba redirecciones automáticas que interferían con la lógica de `auth.js`
5. **🆕 PROBLEMA DE APROBACIÓN**: Cuando un admin aprobaba una peluquería, solo se actualizaba `approved: true` pero no `profileStatus`, causando que apareciera como "pendiente"

## Archivos Modificados

### 1. `assets/js/auth.js`

#### Función `getUserRole` (líneas 406-447)
**Problema**: Verificaba `salonDoc.role === 'salon'` en lugar de solo verificar la existencia del documento.

**Solución**:
```javascript
// Antes
if (salonDoc && salonDoc.role === 'salon') {
    return 'salon';
}

// Después
if (salonDoc) {
    return 'salon';
}
```

#### Función `handleSalonRedirect` (líneas 448-520)
**Problema**: No verificaba prioritariamente el campo `approved: true`.

**Solución**:
```javascript
// Agregado al inicio de la función
if (salonDoc.approved === true) {
    console.log('✅ Salon is already approved, redirecting to index.html');
    hideLoading();
    window.location.href = 'index.html';
    return;
}
```

### 2. `assets/js/main.js` ⚠️ **CRÍTICO**

#### Función `updateUIForLoggedUser` (líneas 116-177)
**Problema**: Causaba redirecciones automáticas que creaban un bucle infinito.

**Solución**:
```javascript
// ELIMINADO: Redirecciones automáticas que causaban bucle
// if (userInfo.role === 'salon' && userInfo.data) {
//     const profileStatus = userInfo.data.profileStatus || 'incomplete';
//     if (profileStatus === 'incomplete') {
//         window.location.href = 'complete-profile.html';
//         return;
//     } else if (profileStatus === 'pending_approval') {
//         window.location.href = 'salon-waiting.html';
//         return;
//     }
// }

// NUEVO: Solo actualizar UI, no redirigir
// FIXED: Remove automatic redirects that cause infinite loops
// The redirect logic is now handled properly in auth.js
// Only update UI here, don't redirect
```

### 3. `assets/js/salon-waiting.js`

#### Función `checkWaitingAccess` (líneas 15-60)
**Problema**: No verificaba si la peluquería ya estaba aprobada.

**Solución**:
```javascript
// Agregado después de obtener salonData
if (salonData.approved === true) {
    console.log('✅ Salon is already approved, redirecting to index.html');
    window.location.href = 'index.html';
    return;
}
```

### 4. `assets/js/complete-profile.js`

#### Función `checkProfileAccess` (líneas 15-60)
**Problema**: No verificaba si la peluquería ya estaba aprobada.

**Solución**:
```javascript
// Agregado después de obtener salonData
if (salonData.approved === true) {
    console.log('✅ Salon is already approved, redirecting to index.html');
    window.location.href = 'index.html';
    return;
}
```

### 5. `assets/js/firebase-integration.js`

#### Función `getUserRole` (líneas 348-384)
**Problema**: Verificaba primero la colección `users` en lugar de las colecciones específicas.

**Solución**:
```javascript
// Reordenado el orden de verificación
// 1. Admins collection
// 2. Salons collection  
// 3. Users collection (como fallback)
```

### 6. `assets/js/admin.js` 🆕 **CRÍTICO**

#### Función `approveSalon` (líneas 447-467)
**Problema**: Solo actualizaba `approved: true` pero no `profileStatus`.

**Solución**:
```javascript
// Agregado profileStatus: 'approved'
await window.FirebaseData.updateDocument('salons', salonId, {
    approved: true,
    featured: true,
    profileStatus: 'approved', // 🆕 CRÍTICO: Actualizar profileStatus
    approvedAt: new Date(),
    approvedBy: currentUser.uid
});
```

### 7. `admin.html` 🆕 **CRÍTICO**

#### Función `approveSalon` (líneas 560-570)
**Problema**: Solo actualizaba `approved: true` pero no `profileStatus`.

**Solución**:
```javascript
// Agregado profileStatus: 'approved'
await updateDoc(docRef, {
    approved: true,
    featured: true,
    profileStatus: 'approved', // 🆕 CRÍTICO: Actualizar profileStatus
    approvedAt: new Date()
});

// Agregada función rejectSalon
rejectSalon: async (salonId, reason) => {
    const docRef = doc(db, 'salons', salonId);
    await updateDoc(docRef, {
        approved: false,
        featured: false,
        profileStatus: 'rejected', // 🆕 CRÍTICO: Actualizar profileStatus
        rejectionReason: reason,
        rejectedAt: new Date()
    });
    return { success: true };
}
```

## Flujo de Redirección Corregido

### Para Peluquerías:

1. **Login exitoso** → `handleSalonRedirect()`
2. **Verificar `approved: true`** → Si es true, redirigir a `index.html`
3. **Verificar `profileStatus`**:
   - `'incomplete'` → `complete-profile.html`
   - `'pending_approval'` → `salon-waiting.html`
   - `'approved'` → `index.html`
   - `'rejected'` → Mostrar error
   - Otros → `complete-profile.html` (fallback)

### Para Admins:

1. **Login exitoso** → `getUserRole()` retorna `'admin'`
2. **Redirigir a** → `admin.html`

### Para Usuarios Regulares:

1. **Login exitoso** → `getUserRole()` retorna `'user'`
2. **Redirigir a** → `index.html`

## Flujo de Aprobación Corregido 🆕

### Cuando un Admin Aprueba una Peluquería:

1. **Admin hace clic en "Aprobar"** → `approveSalon()`
2. **Se actualizan los campos**:
   - `approved: true`
   - `featured: true`
   - `profileStatus: 'approved'` ← **🆕 CRÍTICO**
   - `approvedAt: timestamp`
   - `approvedBy: admin_uid`
3. **Peluquería puede acceder** → `index.html`

### Cuando un Admin Rechaza una Peluquería:

1. **Admin hace clic en "Rechazar"** → `rejectSalon()`
2. **Se actualizan los campos**:
   - `approved: false`
   - `featured: false`
   - `profileStatus: 'rejected'` ← **🆕 CRÍTICO**
   - `rejectionReason: reason`
   - `rejectedAt: timestamp`
3. **Peluquería ve error** → Mostrar mensaje de rechazo

## Estados de ProfileStatus

- **`'incomplete'`**: Perfil no completado → `complete-profile.html`
- **`'pending_approval'`**: Perfil completado, esperando aprobación → `salon-waiting.html`
- **`'approved'`**: Perfil aprobado → `index.html`
- **`'rejected'`**: Perfil rechazado → Mostrar error

## Archivos de Prueba Creados

1. **`test-login-fix.html`**: Prueba del fix del bucle de login
2. **`test-loop-fix.html`**: Prueba específica del bucle de redirección
3. **`test-approval-fix.html`**: Prueba del fix de aprobación de peluquerías

## Resultados Esperados

✅ **Bucle infinito eliminado**: Las peluquerías ya verificadas pueden iniciar sesión sin problemas
✅ **Aprobación funcional**: Las peluquerías aprobadas aparecen como "aprobadas" y pueden acceder al panel
✅ **Redirecciones correctas**: Cada estado redirige a la página correcta
✅ **Consistencia de datos**: `approved` y `profileStatus` están sincronizados
✅ **Manejo de errores**: Casos edge manejados correctamente

## Notas Importantes

- Se mantiene la funcionalidad existente para todos los casos de uso
- **🆕 CRÍTICO**: Se eliminó el bucle infinito causado por redirecciones automáticas en `main.js`
- **🆕 IMPORTANTE**: La lógica de redirección ahora está centralizada en `auth.js`
- **🆕 CRÍTICO**: Se sincronizó `approved` y `profileStatus` en las funciones de aprobación
- **🆕 NUEVO**: Se agregó manejo de estados `rejected` para peluquerías rechazadas 