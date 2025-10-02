# Script PowerShell para actualizar configuración de Firebase de forma segura
# Este script elimina todas las API keys hardcodeadas y las reemplaza con configuración segura

Write-Host "🔐 Iniciando limpieza de seguridad de Firebase..." -ForegroundColor Yellow

# Lista de archivos HTML que necesitan ser actualizados
$htmlFiles = @(
    "admin-login.html",
    "complete-profile.html", 
    "registro-peluqueria.html",
    "salon-settings.html",
    "salon-waiting.html"
)

# Configuración hardcodeada que debe ser eliminada
$oldConfigPattern = @'
        // Firebase Configuration - Usar configuración centralizada
        const firebaseConfig = window.getFirebaseConfig ? window.getFirebaseConfig() : {
            // Fallback configuration
            apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
            authDomain: "pelugo-2025.firebaseapp.com",
            projectId: "pelugo-2025",
            storageBucket: "pelugo-2025.firebasestorage.app",
            messagingSenderId: "588352402376",
            appId: "1:588352402376:web:c8a0d71f296a80464346fd",
            measurementId: "G-4J0EQTQTVS"
        };
'@

# Nueva configuración segura
$newConfigPattern = @'
        // Firebase Configuration - Configuración segura centralizada
        let firebaseConfig;
        try {
            firebaseConfig = window.getFirebaseConfig();
            console.log('✅ Configuración segura de Firebase cargada');
        } catch (error) {
            console.error('🚨 Error cargando configuración de Firebase:', error);
            alert('Error de configuración. Contacte al administrador.');
            throw error;
        }
'@

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "📝 Actualizando $file..." -ForegroundColor Cyan
        
        # Leer contenido del archivo
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Reemplazar configuración hardcodeada
        $content = $content -replace [regex]::Escape($oldConfigPattern), $newConfigPattern
        
        # También reemplazar cualquier otra instancia de la API key
        $content = $content -replace 'apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0"', 'apiKey: window.FIREBASE_API_KEY || "MISSING_API_KEY"'
        
        # Verificar si necesita env-config.js
        if ($content -notmatch 'env-config\.js') {
            # Buscar y agregar env-config.js antes de firebase-config.js
            $content = $content -replace '(<script src="assets/js/firebase-config\.js"></script>)', '<script src="assets/js/env-config.js"></script>`n    $1'
        }
        
        # Escribir archivo actualizado
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "✅ $file actualizado" -ForegroundColor Green
    } else {
        Write-Host "⚠️ $file no encontrado" -ForegroundColor Yellow
    }
}

Write-Host "`n🔐 Limpieza de seguridad completada!" -ForegroundColor Green
Write-Host "📋 Siguientes pasos:" -ForegroundColor Yellow
Write-Host "  1. Verificar que todos los archivos funcionan correctamente" -ForegroundColor White
Write-Host "  2. Configurar variables de entorno en el hosting" -ForegroundColor White 
Write-Host "  3. Rotar las API keys en Firebase Console" -ForegroundColor White