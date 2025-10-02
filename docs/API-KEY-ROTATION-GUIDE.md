# 🔑 GUÍA COMPLETA PARA ROTAR API KEYS DE FIREBASE

## 🚨 SITUACIÓN ACTUAL
- ✅ **CÓDIGO LIMPIO**: Todas las API keys hardcodeadas han sido eliminadas
- ✅ **SISTEMA SEGURO**: Configuración centralizada implementada
- 🚨 **ACCIÓN REQUERIDA**: La API key actual está comprometida y debe ser rotada INMEDIATAMENTE

## 📋 PASOS PARA ROTAR API KEY

### 1. 🔒 ACCEDER A FIREBASE CONSOLE

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **pelugo-2025**
3. Click en el ⚙️ engranaje → **Configuración del proyecto**

### 2. 🔑 GENERAR NUEVA API KEY

1. En la pestaña **General**, busca la sección "Tus aplicaciones"
2. Encuentra tu aplicación web (icono `</>`):
   ```
   Nombre: peluGo 2.0 (o similar)
   App ID: 1:588352402376:web:c8a0d71f296a80464346fd
   ```
3. Click en **Configuración** de tu app web
4. En "Configuración del SDK", verás la configuración actual
5. **Regenerar API Key:**
   - Busca "API Keys" en el menú lateral
   - O ve a **Configuración del proyecto** → pestaña **Claves de API web**
   - Click en **Regenerar clave**

### 3. 🔧 ACTUALIZAR CONFIGURACIÓN LOCAL (TEMPORAL)

Para probar localmente mientras configuramos GitHub Pages:

```javascript
// En assets/js/env-config.js - solo para pruebas locales
function setupDevelopmentConfig() {
    // REEMPLAZA ESTA KEY CON LA NUEVA QUE GENERES
    window.FIREBASE_API_KEY = 'TU_NUEVA_API_KEY_AQUÍ';
    window.FIREBASE_AUTH_DOMAIN = 'pelugo-2025.firebaseapp.com';
    window.FIREBASE_PROJECT_ID = 'pelugo-2025';
    window.FIREBASE_STORAGE_BUCKET = 'pelugo-2025.firebasestorage.app';
    window.FIREBASE_MESSAGING_SENDER_ID = '588352402376';
    window.FIREBASE_APP_ID = '1:588352402376:web:c8a0d71f296a80464346fd';
    window.FIREBASE_MEASUREMENT_ID = 'G-4J0EQTQTVS';
}
```

### 4. 🌐 CONFIGURAR GITHUB PAGES CON SECRETS

#### A. Configurar GitHub Secrets
1. Ve a tu repo: https://github.com/georgeeduardtp/peluGo-2.0
2. Settings → Secrets and variables → Actions
3. Click **New repository secret** para cada uno:

```
FIREBASE_API_KEY = [TU_NUEVA_API_KEY]
FIREBASE_AUTH_DOMAIN = pelugo-2025.firebaseapp.com
FIREBASE_PROJECT_ID = pelugo-2025
FIREBASE_STORAGE_BUCKET = pelugo-2025.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 588352402376
FIREBASE_APP_ID = 1:588352402376:web:c8a0d71f296a80464346fd
FIREBASE_MEASUREMENT_ID = G-4J0EQTQTVS
```

#### B. Crear GitHub Action para Deployment Seguro

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy PeluGo with Secure Config
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Inject Firebase Configuration
      run: |
        # Crear archivo temporal con configuración
        cat > temp_config.js << EOF
        // Configuración inyectada durante build
        window.FIREBASE_API_KEY = '${{ secrets.FIREBASE_API_KEY }}';
        window.FIREBASE_AUTH_DOMAIN = '${{ secrets.FIREBASE_AUTH_DOMAIN }}';
        window.FIREBASE_PROJECT_ID = '${{ secrets.FIREBASE_PROJECT_ID }}';
        window.FIREBASE_STORAGE_BUCKET = '${{ secrets.FIREBASE_STORAGE_BUCKET }}';
        window.FIREBASE_MESSAGING_SENDER_ID = '${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}';
        window.FIREBASE_APP_ID = '${{ secrets.FIREBASE_APP_ID }}';
        window.FIREBASE_MEASUREMENT_ID = '${{ secrets.FIREBASE_MEASUREMENT_ID }}';
        console.log('🔐 Configuración de producción inyectada');
        EOF
        
        # Inyectar en todos los archivos HTML
        for file in *.html; do
          if [ -f "$file" ]; then
            # Añadir script de configuración después del <head>
            sed -i '/<head>/a\    <script src="temp_config.js"></script>' "$file"
          fi
        done
        
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: .
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 5. 🗑️ REVOCAR API KEY ANTIGUA

**IMPORTANTE**: Solo hacer DESPUÉS de verificar que la nueva configuración funciona.

1. En Firebase Console → **Configuración del proyecto**
2. Pestaña **Claves de API web**  
3. Encuentra la clave antigua: `AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0`
4. Click en **Eliminar** o **Revocar**

### 6. 🛡️ CONFIGURAR RESTRICCIONES DE SEGURIDAD

Para la nueva API key:
1. En Firebase Console → **Configuración del proyecto** → **Claves de API web**
2. Click en tu nueva API key
3. **Configurar restricciones**:
   ```
   Restricciones de aplicación:
   ☑️ Restricciones de referente HTTP
   
   Referentes web permitidos:
   - https://georgeeduardtp.github.io/peluGo-2.0/*
   - http://localhost:*/* (solo para desarrollo)
   ```

## ✅ VERIFICACIÓN FINAL

1. **Probar localmente**: `http://localhost:8080` (con servidor local)
2. **Verificar GitHub Pages**: Tu URL de GitHub Pages
3. **Revisar console logs**: Debe mostrar "🔐 Configuración de producción inyectada"
4. **Probar funcionalidades**: Login, registro, etc.

## 🚨 CHECKLIST DE SEGURIDAD

- [ ] Nueva API key generada
- [ ] GitHub Secrets configurados
- [ ] GitHub Action creado
- [ ] Deploy funcionando
- [ ] Funcionalidades probadas
- [ ] API key antigua revocada
- [ ] Restricciones de dominio configuradas

## 📞 SOPORTE

Si tienes problemas:
1. Verifica los logs en GitHub Actions
2. Revisa la consola del navegador
3. Confirma que todos los secrets están configurados
4. Asegúrate de que el dominio está en las restricciones

**¿Necesitas ayuda con algún paso específico?**