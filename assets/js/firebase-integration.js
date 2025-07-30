// Firebase Integration for PeluGo 2.0 - Updated to v12.0.0
// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js';
import { 
    getFirestore, 
    collection, 
    doc,
    query, 
    where, 
    getDocs, 
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    orderBy,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';

// Firebase Configuration - Usar configuración centralizada
let firebaseConfig = null;

// Función para inicializar Firebase con configuración
function initializeFirebase() {
    try {
        // Obtener configuración
        if (window.getFirebaseConfig) {
            firebaseConfig = window.getFirebaseConfig();
        } else {
            // Fallback configuration
            firebaseConfig = {
                apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
                authDomain: "pelugo-2025.firebaseapp.com",
                projectId: "pelugo-2025",
                storageBucket: "pelugo-2025.firebasestorage.app",
                messagingSenderId: "588352402376",
                appId: "1:588352402376:web:c8a0d71f296a80464346fd",
                measurementId: "G-4J0EQTQTVS"
            };
        }
        
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        console.log('✅ Firebase inicializado correctamente');
        
        // Marcar Firebase como listo
        window.firebaseReady = true;
        
        // Inicializar la aplicación
        initializeDatabase();
        
        // Inicializar listener de autenticación
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                currentUserRole = await getUserRole(user.uid);
                updateUIForLoggedUser(user, currentUserRole);
                console.log('User logged in:', user.email, 'Role:', currentUserRole);
            } else {
                currentUser = null;
                currentUserRole = null;
                updateUIForLoggedUser(null, null);
                console.log('User logged out');
            }
        });
        
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        // Fallback a configuración hardcodeada
        firebaseConfig = {
            apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
            authDomain: "pelugo-2025.firebaseapp.com",
            projectId: "pelugo-2025",
            storageBucket: "pelugo-2025.firebasestorage.app",
            messagingSenderId: "588352402376",
            appId: "1:588352402376:web:c8a0d71f296a80464346fd",
            measurementId: "G-4J0EQTQTVS"
        };
        
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        console.log('✅ Firebase inicializado con fallback');
        window.firebaseReady = true;
        initializeDatabase();
    }
}

// Current User State
let currentUser = null;
let currentUserRole = null;

// Inicializar Firebase cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

// Database Initialization
async function initializeDatabase() {
    try {
        console.log('Verificando estructura de la base de datos...');
        
        // Check if we need to create initial collections
        await createInitialCollections();
        
        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

async function createInitialCollections() {
    try {
        // Create categories collection if it doesn't exist
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        
        if (categoriesSnapshot.empty) {
            console.log('Creando colección de categorías...');
            await createCategories();
        }
        
        // Create cities collection if it doesn't exist
        const citiesRef = collection(db, 'cities');
        const citiesSnapshot = await getDocs(citiesRef);
        
        if (citiesSnapshot.empty) {
            console.log('Creando colección de ciudades...');
            await createCities();
        }
        
        // Create app settings if they don't exist
        const settingsRef = collection(db, 'settings');
        const settingsSnapshot = await getDocs(settingsRef);
        
        if (settingsSnapshot.empty) {
            console.log('Creando configuración inicial...');
            await createAppSettings();
        }
        
    } catch (error) {
        console.error('Error creating initial collections:', error);
    }
}

async function createCategories() {
    const categories = [
        {
            id: "corte",
            name: "Corte de Pelo",
            description: "Encuentra los mejores estilistas para tu corte de pelo",
            icon: "fas fa-cut",
            color: "blue",
            active: true,
            order: 1
        },
        {
            id: "barberia", 
            name: "Barbería",
            description: "Servicios especializados de barbería y afeitado",
            icon: "fas fa-user-tie",
            color: "green",
            active: true,
            order: 2
        },
        {
            id: "color",
            name: "Coloración", 
            description: "Tintes y mechas por expertos coloristas",
            icon: "fas fa-palette",
            color: "pink",
            active: true,
            order: 3
        },
        {
            id: "tratamientos",
            name: "Tratamientos",
            description: "Tratamientos capilares y de belleza especializados", 
            icon: "fas fa-spa",
            color: "yellow",
            active: true,
            order: 4
        }
    ];
    
    for (const category of categories) {
        await addDoc(collection(db, 'categories'), {
            ...category,
            createdAt: serverTimestamp()
        });
    }
    
    console.log('✅ Categorías creadas');
}

async function createCities() {
    const cities = [
        { name: "Madrid", count: 0, active: true, coordinates: { lat: 40.4168, lng: -3.7038 } },
        { name: "Barcelona", count: 0, active: true, coordinates: { lat: 41.3851, lng: 2.1734 } },
        { name: "Valencia", count: 0, active: true, coordinates: { lat: 39.4699, lng: -0.3763 } },
        { name: "Sevilla", count: 0, active: true, coordinates: { lat: 37.3886, lng: -5.9823 } },
        { name: "Bilbao", count: 0, active: true, coordinates: { lat: 43.2627, lng: -2.9253 } },
        { name: "Málaga", count: 0, active: true, coordinates: { lat: 36.7213, lng: -4.4214 } },
        { name: "Zaragoza", count: 0, active: true, coordinates: { lat: 41.6561, lng: -0.8773 } },
        { name: "Murcia", count: 0, active: true, coordinates: { lat: 37.9922, lng: -1.1307 } },
        { name: "Las Palmas", count: 0, active: true, coordinates: { lat: 28.1248, lng: -15.4300 } },
        { name: "Palma", count: 0, active: true, coordinates: { lat: 39.5696, lng: 2.6502 } }
    ];
    
    for (const city of cities) {
        await addDoc(collection(db, 'cities'), {
            ...city,
            createdAt: serverTimestamp()
        });
    }
    
    console.log('✅ Ciudades creadas');
}

async function createAppSettings() {
    const settings = {
        appName: "PeluGo",
        version: "2.0",
        features: {
            reservations: false,
            payments: false,
            chat: false,
            notifications: false
        },
        config: {
            adminCode: window.PeluGoConfig?.admin?.secretCode || "PELUGO_ADMIN_2024",
            maxSalonsPerPage: 12,
            autoApproval: false
        },
        stats: {
            totalUsers: 0,
            totalSalons: 0,
            totalReservations: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'settings'), settings);
    console.log('✅ Configuración inicial creada');
}

// Authentication Functions

/**
 * Validate admin code
 */
function validateAdminCode(adminCode) {
    const expectedCode = window.PeluGoConfig?.admin?.secretCode || "PELUGO_ADMIN_2024";
    
    // Validación básica
    if (!adminCode || typeof adminCode !== 'string') {
        return { valid: false, error: 'Código de administrador requerido' };
    }
    
    // Comparación segura (timing attack resistant)
    if (adminCode !== expectedCode) {
        return { valid: false, error: 'Código de administrador incorrecto' };
    }
    
    return { valid: true };
}

/**
 * Register a new user
 */
async function registerUser(email, password, userData, userType) {
    try {
        // Validate admin code if registering as admin
        if (userType === 'admin') {
            const adminValidation = validateAdminCode(userData.adminCode);
            if (!adminValidation.valid) {
                return { success: false, error: adminValidation.error };
            }
        }
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile
        await updateProfile(user, {
            displayName: userData.name || userData.businessName
        });
        
        // Create user document in Firestore
        const userDoc = {
            uid: user.uid,
            email: email,
            role: userType,
            createdAt: serverTimestamp(),
            active: true,
            ...userData
        };
        
        // Remove sensitive data before saving
        delete userDoc.adminCode;
        
        // Save to appropriate collection based on user type
        let collectionName = 'users';
        if (userType === 'salon') {
            collectionName = 'salons';
            userDoc.approved = false;
            userDoc.featured = false;
            userDoc.profileStatus = 'incomplete'; // 🆕 CRÍTICO: Establecer estado inicial
            userDoc.rating = 0;
            userDoc.reviewCount = 0;
            userDoc.services = [];
            userDoc.images = [];
            userDoc.schedule = {
                monday: { open: "09:00", close: "19:00" },
                tuesday: { open: "09:00", close: "19:00" },
                wednesday: { open: "09:00", close: "19:00" },
                thursday: { open: "09:00", close: "20:00" },
                friday: { open: "09:00", close: "20:00" },
                saturday: { open: "10:00", close: "18:00" },
                sunday: { closed: true }
            };
        } else if (userType === 'admin') {
            collectionName = 'admins';
            userDoc.permissions = ['approve_salons', 'manage_users', 'view_analytics'];
            userDoc.registeredAt = serverTimestamp();
        }
        
        // Use UID as document ID for consistency
        const docRef = doc(db, collectionName, user.uid);
        await setDoc(docRef, userDoc);
        
        // Update city count if it's a salon
        if (userType === 'salon' && userData.city) {
            await updateCityCount(userData.city, 1);
        }
        
        // Update app stats
        await updateAppStats(userType);
        
        console.log(`${userType} document created with UID:`, user.uid);
        
        console.log('User registered successfully:', userType);
        return { success: true, user };
        
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in user
 */
async function signInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign out user
 */
async function signOutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user role from Firestore
 */
async function getUserRole(uid) {
    try {
        console.log(`🔍 Getting user role for UID: ${uid}`);
        
        // Check in admins collection first (using UID as document ID)
        const adminDoc = await getDoc(doc(db, 'admins', uid));
        if (adminDoc.exists()) {
            console.log('👑 User is admin');
            return 'admin';
        }
        
        // Check in salons collection (using UID as document ID)
        const salonDoc = await getDoc(doc(db, 'salons', uid));
        if (salonDoc.exists()) {
            console.log('🏪 User is salon owner');
            return 'salon';
        }
        
        // Check in users collection last (using UID as document ID)
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('👤 User is regular user');
            return userData.role || 'user';
        }
        
        console.log('👤 User not found in any collection, defaulting to user');
        return 'user'; // Default role
        
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'user';
    }
}

/**
 * Get featured salons from Firestore
 */
async function getFeaturedSalonsFromFirebase() {
    try {
        const q = query(
            collection(db, 'salons'), 
            where('featured', '==', true),
            where('approved', '==', true),
            where('active', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const salons = [];
        
        querySnapshot.forEach((doc) => {
            salons.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return salons;
        
    } catch (error) {
        console.error('Error fetching salons from Firebase:', error);
        return [];
    }
}

/**
 * Listen to real-time salon updates
 */
function listenToSalonUpdates() {
    try {
        const q = query(
            collection(db, 'salons'), 
            where('featured', '==', true),
            where('approved', '==', true),
            where('active', '==', true)
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const salons = [];
            querySnapshot.forEach((doc) => {
                salons.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Update UI with new salons
            if (window.renderSalons) {
                window.renderSalons(salons);
            }
            if (window.updateStats) {
                window.updateStats(salons);
            }
            
            // Show notification if new salons were added
            if (salons.length > 0 && window.showNotification) {
                window.showNotification('¡Nuevas peluquerías disponibles!', 'success');
            }
        });
        
        return unsubscribe;
        
    } catch (error) {
        console.error('Error setting up salon listener:', error);
        return null;
    }
}

/**
 * Update city count when salon is added/removed
 */
async function updateCityCount(cityName, increment) {
    try {
        const citiesQuery = query(collection(db, 'cities'), where('name', '==', cityName));
        const citiesSnapshot = await getDocs(citiesQuery);
        
        if (!citiesSnapshot.empty) {
            const cityDoc = citiesSnapshot.docs[0];
            const currentCount = cityDoc.data().count || 0;
            await updateDoc(cityDoc.ref, {
                count: currentCount + increment,
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error updating city count:', error);
    }
}

/**
 * Update app statistics
 */
async function updateAppStats(userType) {
    try {
        const settingsQuery = query(collection(db, 'settings'));
        const settingsSnapshot = await getDocs(settingsQuery);
        
        if (!settingsSnapshot.empty) {
            const settingsDoc = settingsSnapshot.docs[0];
            const currentStats = settingsDoc.data().stats || {};
            
            const updates = {
                updatedAt: serverTimestamp()
            };
            
            if (userType === 'user') {
                updates['stats.totalUsers'] = (currentStats.totalUsers || 0) + 1;
            } else if (userType === 'salon') {
                updates['stats.totalSalons'] = (currentStats.totalSalons || 0) + 1;
            }
            
            await updateDoc(settingsDoc.ref, updates);
        }
    } catch (error) {
        console.error('Error updating app stats:', error);
    }
}

/**
 * Get user count from Firebase
 */
async function getUserCount() {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        return snapshot.size;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return 0;
    }
}

/**
 * Get salon count from Firebase
 */
async function getSalonCount() {
    try {
        const salonsQuery = query(
            collection(db, 'salons'),
            where('approved', '==', true),
            where('active', '==', true)
        );
        const snapshot = await getDocs(salonsQuery);
        return snapshot.size;
    } catch (error) {
        console.error('Error fetching salon count:', error);
        return 0;
    }
}

/**
 * Get app statistics
 */
async function getAppStats() {
    try {
        const settingsQuery = query(collection(db, 'settings'));
        const settingsSnapshot = await getDocs(settingsQuery);
        
        if (!settingsSnapshot.empty) {
            const stats = settingsSnapshot.docs[0].data().stats || {};
            return {
                totalUsers: stats.totalUsers || 0,
                totalSalons: stats.totalSalons || 0,
                totalReservations: stats.totalReservations || 0
            };
        }
        
        return { totalUsers: 0, totalSalons: 0, totalReservations: 0 };
    } catch (error) {
        console.error('Error fetching app stats:', error);
        return { totalUsers: 0, totalSalons: 0, totalReservations: 0 };
    }
}

/**
 * Admin function to approve a salon (make it featured)
 */
async function approveSalon(salonId) {
    try {
        if (currentUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can approve salons');
        }
        
        const salonRef = doc(db, 'salons', salonId);
        await updateDoc(salonRef, {
            approved: true,
            featured: true,
            approvedAt: serverTimestamp(),
            approvedBy: currentUser.uid
        });
        
        // Update city count for approved salon
        const salonDoc = await getDoc(salonRef);
        if (salonDoc.exists() && salonDoc.data().city) {
            await updateCityCount(salonDoc.data().city, 0); // Refresh count
        }
        
        console.log('Salon approved successfully');
        return { success: true };
        
    } catch (error) {
        console.error('Error approving salon:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Admin function to reject a salon
 */
async function rejectSalon(salonId, reason) {
    try {
        if (currentUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can reject salons');
        }
        
        const salonRef = doc(db, 'salons', salonId);
        await updateDoc(salonRef, {
            approved: false,
            featured: false,
            rejectionReason: reason,
            rejectedAt: serverTimestamp(),
            rejectedBy: currentUser.uid
        });
        
        console.log('Salon rejected successfully');
        return { success: true };
        
    } catch (error) {
        console.error('Error rejecting salon:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get salons pending approval (for admin panel)
 */
async function getPendingSalons() {
    try {
        if (currentUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can view pending salons');
        }
        
        const q = query(
            collection(db, 'salons'), 
            where('approved', '==', false),
            where('active', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const pendingSalons = [];
        
        querySnapshot.forEach((doc) => {
            pendingSalons.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return pendingSalons;
        
    } catch (error) {
        console.error('Error fetching pending salons:', error);
        return [];
    }
}

/**
 * Update UI based on user authentication state
 */
function updateUIForLoggedUser(user, role) {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (user) {
        // User is logged in
        if (loginBtn) {
            loginBtn.innerHTML = `
                <div class="flex items-center space-x-2 cursor-pointer" onclick="toggleUserMenu()">
                    <i class="fas fa-user-circle text-xl"></i>
                    <span>${user.displayName || user.email}</span>
                    <i class="fas fa-chevron-down text-sm"></i>
                </div>
            `;
        }
        
        // Show role-specific content
        showRoleContent(role);
        
    } else {
        // User is logged out
        if (loginBtn) {
            loginBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>Iniciar sesión</span>
            `;
        }
        
        hideRoleContent();
    }
}

/**
 * Show content based on user role
 */
function showRoleContent(role) {
    // Hide all role-specific content first
    hideRoleContent();
    
    if (role === 'admin') {
        // Show admin-specific content
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.style.display = 'block');
    } else if (role === 'salon') {
        // Show salon-specific content
        const salonElements = document.querySelectorAll('.salon-only');
        salonElements.forEach(el => el.style.display = 'block');
    }
}

/**
 * Hide all role-specific content
 */
function hideRoleContent() {
    const roleElements = document.querySelectorAll('.admin-only, .salon-only');
    roleElements.forEach(el => el.style.display = 'none');
}

/**
 * Toggle user menu dropdown
 */
function toggleUserMenu() {
    // This will be implemented when we add the dropdown menu
    console.log('Toggle user menu');
}

// Export functions for global use
window.FirebaseAuth = {
    registerUser,
    signInUser,
    signOutUser,
    validateAdminCode,
    getCurrentUser: () => currentUser,
    getCurrentUserRole: () => currentUserRole,
    getUserRole,
    deleteUser: deleteUserFromAuth
};

// Export Firebase functions
window.FirebaseData = {
    registerUser,
    signInUser,
    signOutUser,
    getUserRole,
    getFeaturedSalonsFromFirebase,
    listenToSalonUpdates,
    updateCityCount,
    updateAppStats,
    getUserCount,
    getSalonCount,
    getAppStats,
    approveSalon,
    rejectSalon,
    getPendingSalons,
    initializeDatabase,
    getDocument: getDocumentFromFirestore,
    getSalonByUid: getSalonByUid,
    saveWebRegistration: saveWebRegistration,
    getWebRegistrations: getWebRegistrations,
    deleteWebRegistration: deleteWebRegistration,
    deleteDocument: deleteDocumentFromFirestore,
    updateDocument: updateDocument
};

// Global functions for UI
window.updateUIForLoggedUser = updateUIForLoggedUser;
window.toggleUserMenu = toggleUserMenu;

/**
 * Get a document from Firestore
 */
async function getDocumentFromFirestore(collection, documentId) {
    try {
        console.log(`📄 Getting document ${documentId} from ${collection}`);
        const docRef = doc(db, collection, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log(`✅ Document found in ${collection}:`, docSnap.data());
            return docSnap.data();
        } else {
            console.log(`❌ Document not found in ${collection}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error getting document from ${collection}:`, error);
        throw error;
    }
} 

/**
 * Get salon document by UID
 */
async function getSalonByUid(uid) {
    try {
        console.log(`🔍 Getting salon document for UID: ${uid}`);
        const docRef = doc(db, 'salons', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log(`✅ Salon document found for UID: ${uid}`);
            return docSnap.data();
        } else {
            console.log(`❌ Salon document not found for UID: ${uid}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error getting salon document for UID ${uid}:`, error);
            return null;
        }
}

/**
 * Save web registration form data
 */
async function saveWebRegistration(salonData) {
    try {
        console.log('💾 Saving web registration data:', salonData);
        
        // Add metadata
        const registrationData = {
            ...salonData,
            registrationDate: serverTimestamp(),
            status: 'pending',
            source: 'web_form',
            reviewed: false
        };
        
        // Save to web_registrations collection
        const docRef = await addDoc(collection(db, 'web_registrations'), registrationData);
        
        console.log(`✅ Web registration saved with ID: ${docRef.id}`);
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Error saving web registration:', error);
        throw error;
    }
}

/**
 * Get all web registrations
 */
async function getWebRegistrations() {
    try {
        console.log('📋 Getting web registrations...');
        
        const q = query(collection(db, 'web_registrations'), orderBy('registrationDate', 'desc'));
        const snapshot = await getDocs(q);
        
        const registrations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log(`✅ Found ${registrations.length} web registrations`);
        return registrations;
        
    } catch (error) {
        console.error('❌ Error getting web registrations:', error);
        throw error;
    }
}

/**
 * Delete web registration
 */
async function deleteWebRegistration(registrationId) {
    try {
        console.log(`🗑️ Deleting web registration: ${registrationId}`);
        
        const docRef = doc(db, 'web_registrations', registrationId);
        await deleteDoc(docRef);
        
        console.log(`✅ Web registration deleted: ${registrationId}`);
        
    } catch (error) {
        console.error('❌ Error deleting web registration:', error);
        throw error;
    }
}

/**
 * Delete document from Firestore
 */
async function deleteDocumentFromFirestore(collection, documentId) {
    try {
        console.log(`🗑️ Deleting document ${documentId} from ${collection}`);
        const docRef = doc(db, collection, documentId);
        await deleteDoc(docRef);
        
        console.log(`✅ Document deleted from ${collection}: ${documentId}`);
        
    } catch (error) {
        console.error(`❌ Error deleting document from ${collection}:`, error);
        throw error;
    }
}

/**
 * Delete user from Firebase Auth
 */
async function deleteUserFromAuth(email) {
    try {
        console.log(`🗑️ Deleting user from Auth: ${email}`);
        
        // Note: This is a placeholder. In a real implementation, you would need
        // to sign in as the user first or use admin SDK to delete the user
        // For now, we'll just log the attempt
        
        console.log(`⚠️ User deletion from Auth requires admin SDK or user sign-in`);
        console.log(`📧 Email to delete: ${email}`);
        
        // In a production environment, you would implement this using:
        // 1. Admin SDK (server-side)
        // 2. Or sign in as the user first, then delete
        
        return true; // Placeholder return
        
    } catch (error) {
        console.error(`❌ Error deleting user from Auth:`, error);
        throw error;
    }
}

/**
 * Update document in Firestore
 */
async function updateDocument(collectionName, documentId, updates) {
    try {
        console.log(`📝 Updating document ${documentId} in ${collectionName}:`, updates);
        
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        
        console.log(`✅ Document updated in ${collectionName}: ${documentId}`);
        
    } catch (error) {
        console.error(`❌ Error updating document in ${collectionName}:`, error);
        throw error;
    }
} 