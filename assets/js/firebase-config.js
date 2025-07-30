// Firebase Configuration - PeluGo 2.0
// Este archivo centraliza la configuración de Firebase para evitar duplicación

const FirebaseConfig = {
    // Configuración de Firebase
    apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
    authDomain: "pelugo-2025.firebaseapp.com",
    projectId: "pelugo-2025",
    storageBucket: "pelugo-2025.firebasestorage.app",
    messagingSenderId: "588352402376",
    appId: "1:588352402376:web:c8a0d71f296a80464346fd",
    measurementId: "G-4J0EQTQTVS"
};

// Función para obtener la configuración
function getFirebaseConfig() {
    // Para hosting estático, usar configuración directa
    // Las variables de entorno se configuran en el dashboard del hosting
    return FirebaseConfig;
}





// Exportar para uso global
window.FirebaseConfig = FirebaseConfig;
window.getFirebaseConfig = getFirebaseConfig;

console.log('✅ Configuración de Firebase cargada para GitHub Pages'); 