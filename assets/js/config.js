// Configuration file for PeluGo 2.0
// This file contains sensitive configuration that should be customized for production

const PeluGoConfig = {
    // Admin configuration
    admin: {
        // IMPORTANTE: Cambia este código regularmente
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
        environment: "production",
        debug: false
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
    // Para GitHub Pages, usar código hardcodeado
    // En producción, considera cambiar este código regularmente
    return "PELUGO_ADMIN_2024";
}



// Export configuration
window.PeluGoConfig = PeluGoConfig;

// Log para GitHub Pages
console.log('✅ Configuración de PeluGo cargada para GitHub Pages');
console.log('📝 Para cambiar el código admin, edita assets/js/config.js');

console.log('✅ Configuración de PeluGo cargada'); 