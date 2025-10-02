# 🚀 Configuración GitHub Pages - PeluGo 2.0

## 📋 **Pasos para Configurar GitHub Pages**

### **Paso 1: Subir código a GitHub**
```bash
# Asegúrate de que todos los cambios estén subidos
git add .
git commit -m "Preparado para GitHub Pages"
git push origin main
```

### **Paso 2: Habilitar GitHub Pages**
1. Ve a tu repositorio en GitHub
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. ¡Listo! Se desplegará automáticamente

### **Paso 3: Verificar el Despliegue**
1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow "Deploy to GitHub Pages" se ejecute correctamente
3. Tu sitio estará disponible en: `https://tu-usuario.github.io/peluGo-2.0`

## 🔧 **Configuración Específica**

### **URL de tu sitio:**
```
https://tu-usuario.github.io/peluGo-2.0/
```

### **Estructura de archivos:**
```
peluGo-2.0/
├── index.html ✅
├── auth.html ✅
├── registro-peluqueria.html ✅
├── admin.html ✅
├── assets/ ✅
│   ├── css/
│   ├── js/
│   └── images/
├── .github/workflows/deploy.yml ✅
└── netlify.toml (no necesario para GitHub Pages)
```

## ⚠️ **Limitaciones de GitHub Pages**

### **Lo que SÍ funciona:**
- ✅ **Despliegue automático** en cada push
- ✅ **HTTPS automático**
- ✅ **CDN global**
- ✅ **Configuración de Firebase** (hardcodeada)

### **Lo que NO funciona:**
- ❌ **Variables de entorno** (no disponibles)
- ❌ **Headers de seguridad personalizados** (limitados)
- ❌ **Rate limiting** (no disponible)
- ❌ **Servidor Node.js** (solo archivos estáticos)

## 🔒 **Seguridad en GitHub Pages**

### **Configuración Actual:**
```javascript
// assets/js/firebase-config.js
const FirebaseConfig = {
    apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
    authDomain: "pelugo-2025.firebaseapp.com",
    // ... configuración completa
};
```

### **Recomendaciones:**
1. ✅ **La configuración está centralizada** (1 archivo)
2. ✅ **Firebase protege las API keys** automáticamente
3. ✅ **HTTPS está habilitado** por defecto
4. ⚠️ **Considera usar Netlify** para headers de seguridad completos

## 🚀 **Despliegue Automático**

### **Cómo funciona:**
1. **Haces push** a la rama `main`
2. **GitHub Actions** se ejecuta automáticamente
3. **Se despliega** en GitHub Pages
4. **Tu sitio se actualiza** automáticamente

### **Verificar el estado:**
- Ve a **Actions** en tu repositorio
- Busca el workflow "Deploy to GitHub Pages"
- Verifica que esté en verde ✅

## 📝 **Comandos Útiles**

### **Para desarrollo local:**
```bash
# Simular GitHub Pages localmente
python -m http.server 8000
# o
npx serve .
```

### **Para verificar cambios:**
```bash
# Verificar que todo esté subido
git status

# Ver el historial de commits
git log --oneline -5
```

## 🔍 **Solución de Problemas**

### **Problema: El sitio no se actualiza**
```bash
# Verificar que el push se hizo correctamente
git push origin main

# Verificar las Actions en GitHub
# Ir a Actions → Deploy to GitHub Pages
```

### **Problema: Firebase no funciona**
```bash
# Verificar la configuración en la consola del navegador
console.log(window.getFirebaseConfig());

# Verificar que no hay errores de CORS
# GitHub Pages usa HTTPS, Firebase debe estar configurado para HTTPS
```

### **Problema: Rutas no funcionan**
```bash
# GitHub Pages no soporta rutas dinámicas
# Usar rutas relativas en lugar de absolutas
# Ejemplo: href="auth.html" en lugar de href="/auth"
```

## 📊 **Ventajas de GitHub Pages**

### **✅ Pros:**
- **Gratis** para siempre
- **Despliegue automático**
- **HTTPS automático**
- **CDN global**
- **Fácil de configurar**
- **Integrado con GitHub**

### **⚠️ Contras:**
- **Sin variables de entorno**
- **Headers de seguridad limitados**
- **Sin rate limiting**
- **Solo archivos estáticos**

## 🎯 **Recomendación Final**

### **Para desarrollo y proyectos pequeños:**
✅ **GitHub Pages es perfecto**

### **Para producción con alta seguridad:**
⚠️ **Considera Netlify o Vercel**

## 📞 **Soporte**

Si tienes problemas:

1. **Verificar Actions**: Ve a la pestaña Actions en GitHub
2. **Verificar configuración**: Revisa que `deploy.yml` esté correcto
3. **Verificar Firebase**: Abre la consola del navegador
4. **Verificar rutas**: Asegúrate de usar rutas relativas

---

**¡Tu sitio estará disponible en: `https://tu-usuario.github.io/peluGo-2.0/`** 