# 🔥 Firebase Setup Guide para PeluGo 2.0

Esta guía te ayudará a configurar Firebase para tu aplicación PeluGo 2.0.

## 📋 Pasos previos

1. **Crea una cuenta de Firebase** en https://firebase.google.com
2. **Instala Firebase CLI** (opcional, para deployment):
   ```bash
   npm install -g firebase-tools
   ```

## 🚀 Configuración del proyecto

### 1. Crear proyecto en Firebase Console

1. Ve a https://console.firebase.google.com
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `pelugo-2024` (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Selecciona tu país y acepta los términos

### 2. Configurar Authentication

1. En la consola de Firebase, ve a **Authentication**
2. Haz clic en **Comenzar**
3. Ve a la pestaña **Sign-in method**
4. Habilita **Email/Password**:
   - Activa "Email/Password"
   - NO actives "Email link (passwordless sign-in)" por ahora
   - Guarda

### 3. Configurar Firestore Database

1. Ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba** (cambiaremos las reglas después)
4. Selecciona una ubicación cercana (ej: `europe-west3` para España)

### 4. Configurar Storage (opcional, para imágenes)

1. Ve a **Storage**
2. Haz clic en **Comenzar**
3. Acepta las reglas por defecto
4. Selecciona la misma ubicación que Firestore

### 5. Obtener configuración del proyecto

1. Ve a **Configuración del proyecto** (icono de engranaje)
2. Baja hasta **Tus aplicaciones**
3. Haz clic en **Agregar aplicación** → **Web** (`</>`)
4. Nombre de la app: `PeluGo Web`
5. **NO** configures Firebase Hosting por ahora
6. Copia la configuración que aparece

## 🔧 Configuración en el código

### 1. Actualizar firebase-integration.js

Reemplaza la configuración en `assets/js/firebase-integration.js`:

```javascript
// Firebase Configuration - REEMPLAZA CON TUS DATOS
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "tu-app-id-aqui"
};
```

### 2. Estructura de datos en Firestore

Crea estas colecciones manualmente en Firestore Console:

#### Colección: `users`
```json
{
  "uid": "string",
  "email": "string", 
  "role": "user",
  "name": "string",
  "phone": "string",
  "createdAt": "timestamp",
  "active": true
}
```

#### Colección: `salons`
```json
{
  "uid": "string",
  "email": "string",
  "role": "salon", 
  "businessName": "string",
  "contactName": "string",
  "phone": "string",
  "address": "string",
  "city": "string", 
  "description": "string",
  "approved": false,
  "featured": false,
  "active": true,
  "createdAt": "timestamp",
  "rating": 0,
  "reviewCount": 0
}
```

#### Colección: `admins`
```json
{
  "uid": "string",
  "email": "string",
  "role": "admin",
  "name": "string", 
  "createdAt": "timestamp",
  "active": true
}
```

## 🔐 Reglas de seguridad

### Firestore Security Rules

Ve a **Firestore Database** → **Reglas** y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Salons collection
    match /salons/{salonId} {
      // Anyone can read approved salons
      allow read: if resource.data.approved == true && resource.data.active == true;
      
      // Salon owners can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      
      // Allow creation for authenticated users
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      
      // Admins can read/write all salons
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admins collection
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Storage Security Rules (si usas Storage)

Ve a **Storage** → **Reglas**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 👨‍💼 Crear el primer admin

Como necesitas un admin para aprobar peluquerías, crea manualmente el primer admin:

### Opción 1: Desde la app
1. Ve a `auth.html`
2. Registrate como admin con el código: `PELUGO_ADMIN_2024`

### Opción 2: Desde Firebase Console
1. Ve a **Authentication** → **Users**
2. Agrega un usuario manualmente
3. Ve a **Firestore Database**
4. Crea un documento en la colección `admins`:
   ```json
   {
     "uid": "el-uid-del-usuario-creado",
     "email": "admin@pelugo.es",
     "role": "admin",
     "name": "Admin Principal",
     "createdAt": "2024-01-15T10:00:00Z",
     "active": true
   }
   ```

## 🧪 Testing

1. **Registra un usuario normal**: Debería funcionar sin problemas
2. **Registra una peluquería**: Se creará como `approved: false`
3. **Inicia sesión como admin**: Deberías poder ver peluquerías pendientes
4. **Aprueba una peluquería**: Debería aparecer en la página principal

## 🚨 Importante - Código de administrador

**¡CAMBIA EL CÓDIGO DE ADMIN!**

En `assets/js/auth.js`, línea ~300:
```javascript
// Validate admin code (CAMBIA ESTE CÓDIGO!)
if (userData.adminCode !== 'PELUGO_ADMIN_2024') {
    showError('Código de administrador incorrecto');
    return false;
}
```

Cambia `PELUGO_ADMIN_2024` por tu código secreto.

## 📱 Hosting (opcional)

Para hacer deploy de tu app:

```bash
firebase login
firebase init hosting
firebase deploy
```

## 🔧 Troubleshooting

### Error: "Firebase aún no está disponible"
- Asegúrate de que el script de Firebase se carga antes que auth.js
- Verifica que la configuración sea correcta

### Error de CORS
- Asegúrate de que el dominio esté autorizado en Firebase Console
- Ve a **Authentication** → **Settings** → **Authorized domains**

### Las peluquerías no aparecen
- Verifica que están marcadas como `approved: true` y `featured: true`
- Revisa las reglas de seguridad de Firestore

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores
2. Verifica la configuración en Firebase Console
3. Asegúrate de que las reglas de seguridad estén bien configuradas

¡Tu aplicación PeluGo 2.0 con Firebase está lista! 🎉 