// Salon Waiting JavaScript for PeluGo 2.0

let currentUser = null;
let salonData = null;

// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    checkWaitingAccess();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            checkWaitingAccess();
        }
    }, 100);
}

// Check if user has access to waiting page
async function checkWaitingAccess() {
    try {
        console.log('🔐 Starting waiting access check...');
        
        if (!window.firebaseAuth) {
            console.error('❌ Firebase Auth not available');
            showAccessDenied();
            return;
        }

        currentUser = window.firebaseAuth.currentUser;
        console.log('👤 Current user:', currentUser);

        if (!currentUser) {
            console.log('❌ No user logged in');
            showAccessDenied();
            return;
        }

        // Get salon profile data
        console.log('🔍 Getting salon profile...');
        salonData = await window.FirebaseAPI.getSalonProfile(currentUser.uid);
        
        if (!salonData) {
            console.log('❌ No salon data found');
            showAccessDenied();
            return;
        }

        // Check if profile status is correct for waiting page
        if (salonData.profileStatus === 'incomplete') {
            console.log('❌ Profile is incomplete, redirecting...');
            window.location.href = 'complete-profile.html';
            return;
        } else if (salonData.approved) {
            console.log('❌ Salon already approved, redirecting...');
            window.location.href = 'salon-panel.html';
            return;
        } else if (salonData.profileStatus !== 'pending_approval') {
            console.log('❌ Invalid profile status for waiting page');
            showAccessDenied();
            return;
        }

        console.log('✅ Profile is pending approval, allowing access');
        await initializeWaitingPage();

    } catch (error) {
        console.error('❌ Error checking waiting access:', error);
        showAccessDenied();
    }
}

// Show access denied screen
function showAccessDenied() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('accessDenied').classList.remove('hidden');
}

// Initialize waiting page
async function initializeWaitingPage() {
    try {
        // Hide loading screen
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('waitingContent').classList.remove('hidden');

        // Update salon info
        updateSalonInfo();

        // Initialize event listeners
        initializeEventListeners();

        // Load profile summary
        loadProfileSummary();

        // Set up auto-refresh
        setupAutoRefresh();

    } catch (error) {
        console.error('Error initializing waiting page:', error);
        showError('Error al cargar la página');
    }
}

// Update salon info display
function updateSalonInfo() {
    const salonInfo = document.getElementById('salonInfo');
    if (currentUser && salonInfo) {
        const displayName = salonData.contactName || currentUser.displayName || currentUser.email;
        const businessName = salonData.businessName || '';
        
        salonInfo.innerHTML = `
            <div class="text-right">
                <div class="font-medium">${businessName || displayName}</div>
                <div class="text-xs text-gray-500">Peluquería</div>
            </div>
        `;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    console.log('🎛️ Initializing event listeners...');
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('✅ Logout button listener added');
    }

    // Refresh status button
    const refreshStatusBtn = document.getElementById('refreshStatusBtn');
    if (refreshStatusBtn) {
        refreshStatusBtn.addEventListener('click', refreshStatus);
        console.log('✅ Refresh status button listener added');
    }

    console.log('✅ All event listeners initialized');
}

// Load profile summary
function loadProfileSummary() {
    const profileSummary = document.getElementById('profileSummary');
    
    if (!salonData) {
        profileSummary.innerHTML = `
            <div class="text-center py-8 text-red-500 col-span-full">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Error al cargar información del perfil</p>
            </div>
        `;
        return;
    }

    const summaryHTML = `
        <div class="space-y-3">
            <h4 class="font-medium text-gray-900 border-b pb-2">Información Básica</h4>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Nombre:</span>
                    <span class="font-medium">${salonData.businessName || 'No especificado'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Ciudad:</span>
                    <span class="font-medium">${salonData.city || 'No especificada'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Teléfono:</span>
                    <span class="font-medium">${salonData.phone || 'No especificado'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium">${salonData.email || currentUser.email}</span>
                </div>
            </div>
        </div>
        
        <div class="space-y-3">
            <h4 class="font-medium text-gray-900 border-b pb-2">Detalles</h4>
            <div class="space-y-2 text-sm">
                <div>
                    <span class="text-gray-600 block">Dirección:</span>
                    <span class="font-medium">${salonData.address || 'No especificada'}</span>
                </div>
                <div>
                    <span class="text-gray-600 block">Servicios:</span>
                    <div class="flex flex-wrap gap-1 mt-1">
                        ${salonData.services && salonData.services.length > 0 
                            ? salonData.services.map(service => 
                                `<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">${service}</span>`
                              ).join('')
                            : '<span class="text-gray-400 text-xs">No especificados</span>'
                        }
                    </div>
                </div>
                <div>
                    <span class="text-gray-600 block">Descripción:</span>
                    <span class="text-sm">${salonData.description || 'No especificada'}</span>
                </div>
            </div>
        </div>
    `;

    profileSummary.innerHTML = summaryHTML;
}

// Handle logout
async function handleLogout() {
    if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        return;
    }
    
    try {
        console.log('👋 Logging out user...');
        await window.FirebaseAPI.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('❌ Error during logout:', error);
        showError('Error al cerrar sesión');
    }
}

// Refresh status
async function refreshStatus() {
    const refreshBtn = document.getElementById('refreshStatusBtn');
    const originalText = refreshBtn.innerHTML;
    
    try {
        // Show loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Actualizando...';
        refreshBtn.disabled = true;
        
        console.log('🔄 Refreshing salon status...');
        
        // Get fresh salon data
        const freshSalonData = await window.FirebaseAPI.getSalonProfile(currentUser.uid);
        
        if (!freshSalonData) {
            throw new Error('No se pudo obtener la información actualizada');
        }
        
        // Check if status has changed
        if (freshSalonData.approved) {
            // Salon has been approved!
            showSuccess('¡Felicitaciones! Tu peluquería ha sido aprobada');
            setTimeout(() => {
                window.location.href = 'salon-panel.html';
            }, 2000);
        } else if (freshSalonData.profileStatus === 'incomplete') {
            // Something went wrong, profile is incomplete again
            showError('Hay un problema con tu perfil. Serás redirigido para completarlo.');
            setTimeout(() => {
                window.location.href = 'complete-profile.html';
            }, 2000);
        } else if (freshSalonData.profileStatus === 'rejected') {
            // Profile was rejected
            showError('Tu perfil ha sido rechazado. Contacta con soporte para más información.');
        } else {
            // Still pending
            salonData = freshSalonData;
            loadProfileSummary();
            showInfo('Tu perfil sigue en revisión. Te notificaremos cuando esté listo.');
        }
        
    } catch (error) {
        console.error('❌ Error refreshing status:', error);
        showError('Error al actualizar el estado');
    } finally {
        // Restore button
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }
}

// Setup auto-refresh every 5 minutes
function setupAutoRefresh() {
    console.log('⏰ Setting up auto-refresh every 5 minutes');
    
    setInterval(async () => {
        try {
            console.log('🔄 Auto-refreshing status...');
            
            const freshSalonData = await window.FirebaseAPI.getSalonProfile(currentUser.uid);
            
            if (freshSalonData && freshSalonData.approved) {
                // Salon has been approved!
                showSuccess('¡Felicitaciones! Tu peluquería ha sido aprobada');
                setTimeout(() => {
                    window.location.href = 'salon-panel.html';
                }, 2000);
            }
            
        } catch (error) {
            console.error('❌ Error during auto-refresh:', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Notification functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 max-w-md transform transition-all duration-300 translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   'bg-blue-500';
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                type === 'error' ? 'fas fa-exclamation-circle' : 
                'fas fa-info-circle';
                
    notification.classList.add(bgColor);
    
    notification.innerHTML = `
        <div class="flex items-start">
            <i class="${icon} mr-2 mt-0.5"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white opacity-70 hover:opacity-100">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 