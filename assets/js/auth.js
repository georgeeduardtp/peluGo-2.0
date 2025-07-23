// Authentication JavaScript for PeluGo 2.0

// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    initializeAuth();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            initializeAuth();
        }
    }, 100);
}

function initializeAuth() {
    initAuthForms();
    initUserTypeSelection();
    handleURLParameters();
}

// Handle URL parameters to pre-select tab 
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    // Switch to register tab if specified
    if (tab === 'register') {
        switchTab('register');
    }
    
    // Always user type now, so no need to handle type parameter
}

// Initialize auth forms
function initAuthForms() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Tab switching
    loginTab.addEventListener('click', () => switchTab('login'));
    registerTab.addEventListener('click', () => switchTab('register'));

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

// Switch between login and register tabs
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Initialize user type selection (simplified for user-only registration)
function initUserTypeSelection() {
    // No longer needed since we only have user registration
    // Keep function for compatibility
    console.log('User registration initialized');
}

// Update visual selection of user type
function updateUserTypeSelection(selectedType) {
    const options = document.querySelectorAll('.user-type-option');
    
    options.forEach(option => {
        const input = option.querySelector('input');
        const border = option.querySelector('div:last-child');
        
        if (input.value === selectedType) {
            border.classList.remove('border-gray-200');
            border.classList.add('border-purple-500', 'bg-purple-50');
        } else {
            border.classList.add('border-gray-200');
            border.classList.remove('border-purple-500', 'bg-purple-50');
        }
    });
}

// Show user-specific fields based on selected type
function showUserSpecificFields(userType) {
    const userFields = document.getElementById('userFields');
    const salonFields = document.getElementById('salonFields');
    const adminFields = document.getElementById('adminFields');

    // Hide all fields first
    userFields.classList.add('hidden');
    salonFields.classList.add('hidden');
    adminFields.classList.add('hidden');

    // Show relevant fields
    if (userType === 'user') {
        userFields.classList.remove('hidden');
        // Make user fields required
        document.getElementById('userName').required = true;
        document.getElementById('userPhone').required = true;
        // Remove required from other fields
        removeRequiredFromSalonFields();
        removeRequiredFromAdminFields();
    } else if (userType === 'salon') {
        salonFields.classList.remove('hidden');
        // Make salon fields required
        document.getElementById('salonBusinessName').required = true;
        document.getElementById('salonContactName').required = true;
        document.getElementById('salonPhone').required = true;
        document.getElementById('salonAddress').required = true;
        document.getElementById('salonCity').required = true;
        // Remove required from other fields
        removeRequiredFromUserFields();
        removeRequiredFromAdminFields();
    } else if (userType === 'admin') {
        adminFields.classList.remove('hidden');
        // Make admin fields required
        document.getElementById('adminName').required = true;
        document.getElementById('adminCode').required = true;
        // Remove required from other fields
        removeRequiredFromUserFields();
        removeRequiredFromSalonFields();
    }
}

// Helper functions to remove required attribute
function removeRequiredFromUserFields() {
    document.getElementById('userName').required = false;
    document.getElementById('userPhone').required = false;
}

function removeRequiredFromSalonFields() {
    document.getElementById('salonBusinessName').required = false;
    document.getElementById('salonContactName').required = false;
    document.getElementById('salonPhone').required = false;
    document.getElementById('salonAddress').required = false;
    document.getElementById('salonCity').required = false;
}

function removeRequiredFromAdminFields() {
    document.getElementById('adminName').required = false;
    document.getElementById('adminCode').required = false;
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    showLoading('Iniciando sesión...', 'Verificando credenciales');

    try {
        // Wait for Firebase to be available
        if (!window.FirebaseAuth) {
            throw new Error('Firebase aún no está disponible. Intenta de nuevo en unos segundos.');
        }

        const result = await window.FirebaseAuth.signInUser(email, password);
        
        if (result.success) {
            console.log('✅ Login successful, result:', result);
            console.log('👤 User object:', {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName
            });
            
            // Check user role and redirect appropriately
            console.log('🔍 Determining user role...');
            const userRole = await getUserRole(result.user.uid);
            console.log('👤 User role determined:', userRole);
            
            if (userRole === 'admin') {
                console.log('🎯 Admin login detected, redirecting to admin panel...');
                hideLoading();
                window.location.href = 'admin.html';
            } else if (userRole === 'salon') {
                console.log('🎯 Salon login detected, checking profile status...');
                await handleSalonRedirect(result.user.uid);
            } else {
                console.log('🎯 Regular user login detected, redirecting to home...');
                hideLoading();
                window.location.href = 'index.html';
            }
        } else {
            console.error('❌ Login failed:', result.error);
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError(getErrorMessage(error.message));
    } finally {
        hideLoading();
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = getRegistrationFormData();
    
    if (!validateRegistrationForm(formData)) {
        return;
    }

    showLoading('Creando cuenta...', 'Esto puede tardar unos segundos');

    try {
        // Wait for Firebase to be available
        if (!window.FirebaseAuth) {
            throw new Error('Firebase aún no está disponible. Intenta de nuevo en unos segundos.');
        }

        const result = await window.FirebaseAuth.registerUser(
            formData.email,
            formData.password,
            formData.userData,
            formData.userType
        );
        
        if (result.success) {
            showSuccess(
                '¡Cuenta creada!', 
                'Tu cuenta de usuario ha sido creada correctamente. Ya puedes buscar y reservar en las mejores peluquerías.',
                () => {
                    window.location.href = 'index.html';
                }
            );
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showError(getErrorMessage(error.message));
    } finally {
        hideLoading();
    }
}

// Get registration form data (simplified for users only)
function getRegistrationFormData() {
    const userType = 'user'; // Always user now
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    const userData = {
        name: document.getElementById('userName').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        city: document.getElementById('userCity').value || null
    };

    return {
        userType,
        email,
        password,
        userData
    };
}

// Validate registration form (simplified for users only)
function validateRegistrationForm(formData) {
    const { email, password, userData } = formData;

    // Basic validation
    if (!email || !password) {
        showError('Email y contraseña son obligatorios');
        return false;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    if (!isValidEmail(email)) {
        showError('Por favor ingresa un email válido');
        return false;
    }

    // User validation
    if (!userData.name) {
        showError('El nombre es obligatorio');
        return false;
    }

    if (!userData.phone) {
        showError('El teléfono es obligatorio');
        return false;
    }

    // Terms acceptance
    if (!document.getElementById('acceptTerms').checked) {
        showError('Debes aceptar los términos y condiciones');
        return false;
    }

    return true;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Loading modal functions
function showLoading(title, subtitle) {
    document.getElementById('loadingText').textContent = title;
    document.getElementById('loadingSubtext').textContent = subtitle;
    document.getElementById('loadingModal').classList.remove('hidden');
    document.getElementById('loadingModal').classList.add('flex');
}

function hideLoading() {
    document.getElementById('loadingModal').classList.add('hidden');
    document.getElementById('loadingModal').classList.remove('flex');
}

// Success modal functions
function showSuccess(title, message, callback) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
    document.getElementById('successModal').classList.add('flex');
    
    // Store callback for later use
    window.successCallback = callback;
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
    document.getElementById('successModal').classList.remove('flex');
    
    if (window.successCallback) {
        window.successCallback();
        window.successCallback = null;
    }
}

// Error modal functions
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
    document.getElementById('errorModal').classList.add('flex');
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.add('hidden');
    document.getElementById('errorModal').classList.remove('flex');
}

// Get user-friendly error messages
function getErrorMessage(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'Este email ya está registrado. Intenta iniciar sesión.',
        'auth/weak-password': 'La contraseña es muy débil. Usa al menos 6 caracteres.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/user-not-found': 'No existe una cuenta con este email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
        'auth/invalid-credential': 'Credenciales inválidas. Verifica tu email y contraseña.'
    };

    return errorMessages[error] || `Error: ${error}`;
}

// Get user role from Firestore
async function getUserRole(uid) {
    try {
        console.log('🔍 Getting user role for UID:', uid);
        
        if (!window.FirebaseData) {
            console.error('❌ FirebaseData not available in getUserRole');
            return 'user';
        }

        console.log('✅ FirebaseData available, checking admin document...');
        // Check if user is admin
        const adminDoc = await window.FirebaseData.getDocument('admins', uid);
        console.log('📄 Admin document result:', adminDoc);
        
        if (adminDoc && adminDoc.role === 'admin') {
            console.log('👑 User is admin - role confirmed');
            return 'admin';
        }

        console.log('✅ Not admin, checking salon document...');
        // Check if user is salon
        const salonDoc = await window.FirebaseData.getDocument('salons', uid);
        console.log('📄 Salon document result:', salonDoc);
        
        if (salonDoc && salonDoc.role === 'salon') {
            console.log('🏪 User is salon owner - role confirmed');
            return 'salon';
        }

        console.log('👤 User is regular user - no admin/salon document found');
        return 'user';
    } catch (error) {
        console.error('❌ Error getting user role:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            uid: uid
        });
        return 'user';
    }
}

// Handle salon redirect based on profile status
async function handleSalonRedirect(uid) {
    try {
        console.log('🔍 Starting salon redirect for UID:', uid);
        console.log('🔍 Checking if FirebaseData is available...');
        
        if (!window.FirebaseData) {
            console.error('❌ FirebaseData not available, redirecting to index');
            showError('Error: Sistema no disponible. Redirigiendo...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        console.log('✅ FirebaseData available, getting salon document...');
        const salonDoc = await window.FirebaseData.getDocument('salons', uid);
        
        console.log('📄 Salon document received:', salonDoc);
        
        if (!salonDoc) {
            console.error('❌ No salon document found for UID:', uid);
            showError('Error: No se encontraron datos de la peluquería. Contacta con soporte.');
            return;
        }

        const profileStatus = salonDoc.profileStatus || 'incomplete';
        console.log('📋 Profile status found:', profileStatus);
        console.log('📋 Full salon data:', {
            profileStatus: salonDoc.profileStatus,
            approved: salonDoc.approved,
            businessName: salonDoc.businessName,
            email: salonDoc.email,
            role: salonDoc.role
        });

        if (profileStatus === 'incomplete') {
            console.log('➡️ IMMEDIATE REDIRECT to complete-profile.html...');
            
            // Hide loading modal first
            hideLoading();
            
            // Direct redirect without modal for debugging
            console.log('🔄 Executing IMMEDIATE redirect to complete-profile.html');
            window.location.href = 'complete-profile.html';
            
        } else if (profileStatus === 'pending_approval') {
            console.log('➡️ IMMEDIATE REDIRECT to salon-waiting.html...');
            
            // Hide loading modal first
            hideLoading();
            
            // Direct redirect without modal for debugging
            console.log('🔄 Executing IMMEDIATE redirect to salon-waiting.html');
            window.location.href = 'salon-waiting.html';
            
        } else if (salonDoc.approved) {
            console.log('➡️ IMMEDIATE REDIRECT to salon-panel.html...');
            
            // Hide loading modal first
            hideLoading();
            
            // Direct redirect without modal for debugging
            console.log('🔄 Executing IMMEDIATE redirect to salon-panel.html');
            window.location.href = 'salon-panel.html';
            
        } else {
            // Fallback case
            console.log('⚠️ Fallback case - IMMEDIATE REDIRECT to complete-profile.html');
            console.log('🔍 Fallback triggered because:', {
                profileStatus,
                approved: salonDoc.approved,
                conditions: {
                    isIncomplete: profileStatus === 'incomplete',
                    isPending: profileStatus === 'pending_approval',
                    isApproved: salonDoc.approved
                }
            });
            
            // Hide loading modal first
            hideLoading();
            
            // Direct redirect without modal for debugging
            console.log('🔄 Executing IMMEDIATE fallback redirect to complete-profile.html');
            window.location.href = 'complete-profile.html';
        }
    } catch (error) {
        console.error('❌ Error handling salon redirect:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            uid: uid
        });
        showError('Error al verificar el estado de tu perfil: ' + error.message);
    }
}

// CSS for auth tabs
const style = document.createElement('style');
style.textContent = `
    .auth-tab {
        background-color: transparent;
        color: #6b7280;
        font-weight: 500;
    }
    
    .auth-tab.active {
        background-color: white;
        color: #8b5cf6;
        font-weight: 600;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .user-type-option input:checked + div {
        border-color: #8b5cf6 !important;
        background-color: #f3f4f6 !important;
    }
`;
document.head.appendChild(style); 