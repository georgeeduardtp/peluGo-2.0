// Configuración de Variables de Entorno - PeluGo 2.0
// Este script debe ser cargado ANTES que firebase-config.js

(function() {
    'use strict';
    
    // Función para cargar configuración desde diferentes fuentes
    function loadEnvironmentConfig() {
        // 1. Intentar cargar desde meta tags (configurados por el build process)
        const metaTags = {
            apiKey: getMetaContent('firebase-api-key'),
            authDomain: getMetaContent('firebase-auth-domain'),
            projectId: getMetaContent('firebase-project-id'),
            storageBucket: getMetaContent('firebase-storage-bucket'),
            messagingSenderId: getMetaContent('firebase-messaging-sender-id'),
            appId: getMetaContent('firebase-app-id'),
            measurementId: getMetaContent('firebase-measurement-id')
        };
        
        // 2. Configurar variables globales solo si están disponibles
        Object.keys(metaTags).forEach(key => {
            if (metaTags[key]) {
                const envKey = `FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
                window[envKey] = metaTags[key];
                console.log(`✅ Configurado ${envKey} desde meta tag`);
            }
        });
        
        // 3. Fallback para desarrollo local
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('🔧 Modo desarrollo detectado - usando configuración local');
            setupDevelopmentConfig();
        }
        
        console.log('🔐 Configuración de entorno cargada de forma segura');
    }
    
    // Función helper para obtener contenido de meta tags
    function getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.getAttribute('content') : null;
    }
    
    // Configuración para desarrollo local
    function setupDevelopmentConfig() {
        // Estas son claves de desarrollo - NUNCA usar en producción
        // API Key configurada para desarrollo local
        window.FIREBASE_API_KEY = 'AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0';
        window.FIREBASE_AUTH_DOMAIN = 'pelugo-2025.firebaseapp.com';
        window.FIREBASE_PROJECT_ID = 'pelugo-2025';
        window.FIREBASE_STORAGE_BUCKET = 'pelugo-2025.firebasestorage.app';
        window.FIREBASE_MESSAGING_SENDER_ID = '588352402376';
        window.FIREBASE_APP_ID = '1:588352402376:web:c8a0d71f296a80464346fd';
        window.FIREBASE_MEASUREMENT_ID = 'G-4J0EQTQTVS';
        console.log('🚨 USANDO CONFIGURACIÓN DE DESARROLLO');
    }
    
    // Cargar configuración al inicio
    loadEnvironmentConfig();
    
})();