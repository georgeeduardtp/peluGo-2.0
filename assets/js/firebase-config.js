// Firebase Configuration - PeluGo 2.0
// CONFIGURACIÓN SEGURA - No expone claves directamente

// Función para obtener configuración de forma segura
function getSecureFirebaseConfig() {
    // En entorno de desarrollo/local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('🚨 Usando configuración de desarrollo');
        return {
            // Estas son claves de desarrollo/test - NUNCA usar en producción
            apiKey: "dev-key-placeholder",
            authDomain: "pelugo-dev.firebaseapp.com",
            projectId: "pelugo-dev",
            storageBucket: "pelugo-dev.firebasestorage.app",
            messagingSenderId: "000000000000",
            appId: "1:000000000000:web:development",
            measurementId: "G-DEV123456"
        };
    }
    
    // En producción, intentar obtener de variables de entorno configuradas por el hosting
    // GitHub Pages y otros servicios pueden inyectar estas variables
    const config = {
        apiKey: window.FIREBASE_API_KEY || "MISSING_API_KEY",
        authDomain: window.FIREBASE_AUTH_DOMAIN || "pelugo-2025.firebaseapp.com",
        projectId: window.FIREBASE_PROJECT_ID || "pelugo-2025", 
        storageBucket: window.FIREBASE_STORAGE_BUCKET || "pelugo-2025.firebasestorage.app",
        messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "588352402376",
        appId: window.FIREBASE_APP_ID || "1:588352402376:web:c8a0d71f296a80464346fd",
        measurementId: window.FIREBASE_MEASUREMENT_ID || "G-4J0EQTQTVS"
    };
    
    // Validar que tenemos la configuración necesaria
    if (config.apiKey === "MISSING_API_KEY") {
        console.error('🚨 CONFIGURACIÓN DE FIREBASE FALTANTE - Contactar al administrador');
        throw new Error('Firebase configuration missing');
    }
    
    return config;
}

// Función legacy - mantener compatibilidad
function getFirebaseConfig() {
    return getSecureFirebaseConfig();
}





// Exportar funciones seguras
window.getFirebaseConfig = getFirebaseConfig;
window.getSecureFirebaseConfig = getSecureFirebaseConfig;

// NO exportar configuración directa por seguridad
console.log('✅ Sistema de configuración segura de Firebase cargado'); 