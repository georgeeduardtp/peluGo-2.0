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
        window.FIREBASE_API_KEY = 'dev-key-' + Math.random().toString(36).substr(2, 9);
        window.FIREBASE_AUTH_DOMAIN = 'localhost';
        window.FIREBASE_PROJECT_ID = 'pelugo-dev';
        console.log('🚨 USANDO CONFIGURACIÓN DE DESARROLLO');
    }
    
    // Cargar configuración al inicio
    loadEnvironmentConfig();
    
})();