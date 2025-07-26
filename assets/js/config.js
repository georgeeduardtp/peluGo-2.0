// Configuration file for PeluGo 2.0
// This file contains sensitive configuration that should be customized for production

const PeluGoConfig = {
    // Admin configuration
    admin: {
        // IMPORTANTE: Cambia este código en producción
        // Puedes usar variables de entorno o un sistema más seguro
        secretCode: getAdminCode(),
        
        // Configuración adicional de admin
        maxLoginAttempts: 5,
        sessionTimeout: 3600000, // 1 hora en ms
        requireTwoFactor: false // Para futuras implementaciones
    },
    
    // App configuration
    app: {
        name: "PeluGo",
        version: "2.0",
        environment: getEnvironment(),
        debug: isDevelopment()
    },
    
    // Security configuration
    security: {
        minPasswordLength: 6,
        requireStrongPassword: false,
        maxFailedLogins: 3,
        lockoutDuration: 900000 // 15 minutos
    }
};

// Helper functions
function getAdminCode() {
    // En desarrollo, usar código por defecto
    if (isDevelopment()) {
        return "PELUGO_ADMIN_2024";
    }
    
    // En producción, intentar obtener de variable de entorno
    // Esto funciona si usas un bundler o sistema de build
    if (typeof process !== 'undefined' && process.env.ADMIN_CODE) {
        return process.env.ADMIN_CODE;
    }
    
    // Fallback: puedes cambiar esto manualmente
    return "PELUGO_ADMIN_2024";
}

function getEnvironment() {
    // Detectar entorno basado en la URL
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:') {
        return 'development';
    }
    return 'production';
}

function isDevelopment() {
    return getEnvironment() === 'development';
}

// Export configuration
window.PeluGoConfig = PeluGoConfig;

// Log warning in development
if (isDevelopment()) {
    console.warn('⚠️ DESARROLLO: Usando código admin por defecto. Cambia esto en producción.');
    console.warn('📝 Para cambiar el código admin, edita assets/js/config.js');
}

console.log('✅ Configuración de PeluGo cargada'); 