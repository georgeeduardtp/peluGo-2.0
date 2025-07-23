// Admin Panel JavaScript for PeluGo 2.0

let currentUser = null;
let currentUserRole = null;
let allSalons = [];
let allUsers = [];

// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    checkAdminAccess();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            checkAdminAccess();
        }
    }, 100);
}

// Check if user has admin access
async function checkAdminAccess() {
    try {
        console.log('🔐 Starting admin access check...');
        
        // Firebase should be ready at this point
        if (!window.firebaseAuth) {
            console.error('❌ Firebase Auth not available');
            showAccessDenied();
            return;
        }

        console.log('✅ Firebase available directly');

        currentUser = window.firebaseAuth.currentUser;
        console.log('👤 Current user:', currentUser);

        if (!currentUser) {
            console.log('❌ No user logged in');
            showAccessDenied();
            return;
        }

        console.log('📧 User email:', currentUser.email);
        console.log('🆔 User UID:', currentUser.uid);

        // Check if user is admin by looking at Firestore document
        console.log('🔍 Checking admin document in Firestore...');
        
        try {
            const adminDoc = await window.FirebaseData.getDocument('admins', currentUser.uid);
            console.log('📄 Admin document:', adminDoc);
            
            if (adminDoc && adminDoc.role === 'admin') {
                console.log('✅ User is confirmed admin');
                currentUserRole = 'admin';
                await initializeAdminPanel();
            } else {
                console.log('❌ User is not admin or document not found');
                showAccessDenied();
            }
        } catch (docError) {
            console.error('❌ Error checking admin document:', docError);
            showAccessDenied();
        }

    } catch (error) {
        console.error('❌ Error checking admin access:', error);
        showAccessDenied();
    }
}

// Show access denied screen
function showAccessDenied() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('accessDenied').classList.remove('hidden');
}

// Initialize admin panel
async function initializeAdminPanel() {
    try {
        // Hide loading screen
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('adminContent').classList.remove('hidden');

        // Update admin info
        updateAdminInfo();

        // Initialize event listeners
        initializeEventListeners();

        // Load initial data
        await loadDashboardStats();
        await loadSalons();

    } catch (error) {
        console.error('Error initializing admin panel:', error);
        showError('Error al cargar el panel de administración');
    }
}

// Update admin info display
function updateAdminInfo() {
    const adminInfo = document.getElementById('adminInfo');
    if (currentUser && adminInfo) {
        adminInfo.innerHTML = `
            <span class="font-medium">${currentUser.displayName || currentUser.email}</span>
            <span class="text-gray-500">Admin</span>
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
    } else {
        console.warn('❌ Logout button not found');
    }

    // Tab navigation
    const adminTabs = document.querySelectorAll('.admin-tab');
    console.log(`📋 Found ${adminTabs.length} admin tabs`);
    
    adminTabs.forEach((tab, index) => {
        const tabName = tab.dataset.tab;
        console.log(`🔗 Adding listener to tab ${index}: ${tabName}`);
        
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🖱️ Tab clicked: ${tabName}`);
            switchTab(tabName);
        });
    });

    // Salon filters
    const salonFilters = document.querySelectorAll('.salon-filter');
    console.log(`🔍 Found ${salonFilters.length} salon filters`);
    
    salonFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            filterSalons(this.dataset.filter);
        });
    });

    // Create salon form
    const createSalonForm = document.getElementById('createSalonForm');
    if (createSalonForm) {
        createSalonForm.addEventListener('submit', handleCreateSalon);
        console.log('✅ Create salon form listener added');
    } else {
        console.warn('❌ Create salon form not found');
    }
    
    console.log('✅ All event listeners initialized');
}

// Handle logout
async function handleLogout() {
    try {
        await window.FirebaseAuth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        showError('Error al cerrar sesión');
    }
}

// Switch between tabs
function switchTab(tabName) {
    console.log(`🔄 Switching to tab: "${tabName}"`);
    
    // Update tab buttons
    const allTabs = document.querySelectorAll('.admin-tab');
    console.log(`📋 Found ${allTabs.length} tab buttons to update`);
    
    allTabs.forEach((tab, index) => {
        const tabDataValue = tab.dataset.tab;
        console.log(`🔘 Tab ${index}: data-tab="${tabDataValue}"`);
        
        tab.classList.remove('active', 'border-purple-500', 'text-purple-600');
        tab.classList.add('border-transparent', 'text-gray-500');
    });

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active', 'border-purple-500', 'text-purple-600');
        activeTab.classList.remove('border-transparent', 'text-gray-500');
        console.log(`✅ Tab button activated: ${tabName}`);
    } else {
        console.error(`❌ Tab button not found for: ${tabName}`);
        console.log('Available tabs:', Array.from(allTabs).map(t => t.dataset.tab));
    }

    // Show/hide tab content
    const allContent = document.querySelectorAll('.tab-content');
    console.log(`📄 Found ${allContent.length} content sections to hide`);
    
    allContent.forEach((content, index) => {
        const contentId = content.id;
        console.log(`📄 Content ${index}: id="${contentId}"`);
        content.classList.add('hidden');
    });

    const targetContentId = `${tabName}Tab`;
    const activeContent = document.getElementById(targetContentId);
    
    if (activeContent) {
        activeContent.classList.remove('hidden');
        console.log(`✅ Content shown: ${targetContentId}`);
        
        // Verify content is visible
        const isHidden = activeContent.classList.contains('hidden');
        console.log(`🔍 Content visibility check: hidden=${isHidden}`);
        
        // Load tab-specific data
        if (tabName === 'users') {
            console.log('🔄 Loading users data...');
            loadUsers();
        } else if (tabName === 'settings') {
            console.log('🔄 Loading settings data...');
            loadSettings();
        } else if (tabName === 'create-salon') {
            console.log('✅ Create salon tab activated - no additional data to load');
        }
    } else {
        console.error(`❌ Content not found for: ${targetContentId}`);
        console.log('Available content IDs:', Array.from(allContent).map(c => c.id));
    }
    
    console.log(`🏁 Tab switch complete: ${tabName}`);
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Get users count
        const users = await window.FirebaseData.getCollection('users');
        document.getElementById('totalUsers').textContent = users.length;

        // Get salons count (approved)
        const approvedSalons = await window.FirebaseData.getCollection('salons', {
            field: 'approved',
            operator: '==',
            value: true
        });
        document.getElementById('activeSalons').textContent = approvedSalons.length;

        // Get pending salons count
        const pendingSalons = await window.FirebaseData.getCollection('salons', {
            field: 'approved',
            operator: '==',
            value: false
        });
        document.getElementById('pendingSalons').textContent = pendingSalons.length;

        // Set reservations to 0 for now
        document.getElementById('totalReservations').textContent = 0;

        console.log('📊 Dashboard stats loaded:', {
            users: users.length,
            approvedSalons: approvedSalons.length,
            pendingSalons: pendingSalons.length
        });

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Set default values
        document.getElementById('totalUsers').textContent = 0;
        document.getElementById('activeSalons').textContent = 0;
        document.getElementById('pendingSalons').textContent = 0;
        document.getElementById('totalReservations').textContent = 0;
    }
}

// Load salons data
async function loadSalons() {
    try {
        const salonsList = document.getElementById('salonsList');
        salonsList.innerHTML = `
            <div class="text-center py-8">
                <div class="loading mx-auto mb-4"></div>
                <p class="text-gray-600">Cargando peluquerías...</p>
            </div>
        `;

        // Get all salons
        const allSalonsData = await window.FirebaseData.getCollection('salons');
        
        // Separate by approval status
        const pendingSalons = allSalonsData.filter(salon => !salon.approved);
        const approvedSalons = allSalonsData.filter(salon => salon.approved);
        
        allSalons = allSalonsData;

        // Update counters
        document.getElementById('pendingCount').textContent = pendingSalons.length;
        document.getElementById('approvedCount').textContent = approvedSalons.length;

        console.log('🏪 Salons loaded:', {
            total: allSalons.length,
            pending: pendingSalons.length,
            approved: approvedSalons.length
        });

        // Render salons (default to pending)
        renderSalons(pendingSalons, 'pending');

    } catch (error) {
        console.error('Error loading salons:', error);
        document.getElementById('salonsList').innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Error al cargar las peluquerías</p>
            </div>
        `;
    }
}

// Filter salons by status
function filterSalons(filter) {
    // Update filter buttons
    document.querySelectorAll('.salon-filter').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeFilter = document.querySelector(`[data-filter="${filter}"]`);
    if (activeFilter) {
        activeFilter.classList.add('bg-purple-600', 'text-white');
        activeFilter.classList.remove('bg-gray-200', 'text-gray-700');
    }

    // Filter and render salons
    let filteredSalons = [];
    if (filter === 'pending') {
        filteredSalons = allSalons.filter(salon => !salon.approved);
    } else if (filter === 'approved') {
        filteredSalons = allSalons.filter(salon => salon.approved);
    } else {
        filteredSalons = allSalons;
    }

    renderSalons(filteredSalons, filter);
}

// Render salons list
function renderSalons(salons, filter) {
    const salonsList = document.getElementById('salonsList');

    if (salons.length === 0) {
        const emptyMessage = filter === 'pending' ? 
            'No hay peluquerías pendientes de aprobación' :
            filter === 'approved' ? 
            'No hay peluquerías aprobadas' :
            'No hay peluquerías registradas';

        salonsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-store text-4xl mb-4"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    const salonsHTML = salons.map(salon => `
        <div class="border border-gray-200 rounded-lg p-6 mb-4">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900">${salon.businessName || salon.name}</h3>
                    <p class="text-gray-600">${salon.contactName || salon.displayName}</p>
                    <p class="text-sm text-gray-500">${salon.email}</p>
                </div>
                <div class="flex items-center space-x-2">
                    ${salon.approved ? 
                        '<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Aprobada</span>' :
                        '<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pendiente</span>'
                    }
                    ${salon.featured ? 
                        '<span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Destacada</span>' :
                        ''
                    }
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600"><strong>Dirección:</strong> ${salon.address || 'No especificada'}</p>
                    <p class="text-sm text-gray-600"><strong>Ciudad:</strong> ${salon.city || 'No especificada'}</p>
                    <p class="text-sm text-gray-600"><strong>Teléfono:</strong> ${salon.phone || 'No especificado'}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600"><strong>Rating:</strong> ${salon.rating || 0}/5</p>
                    <p class="text-sm text-gray-600"><strong>Reseñas:</strong> ${salon.reviewCount || 0}</p>
                    <p class="text-sm text-gray-600"><strong>Creada:</strong> ${formatDate(salon.createdAt)}</p>
                </div>
            </div>

            ${salon.description ? `
                <div class="mb-4">
                    <p class="text-sm text-gray-600"><strong>Descripción:</strong></p>
                    <p class="text-sm text-gray-700">${salon.description}</p>
                </div>
            ` : ''}

            <div class="flex justify-end space-x-3">
                ${!salon.approved ? `
                    <button 
                        onclick="approveSalon('${salon.id}')"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                    >
                        <i class="fas fa-check mr-2"></i>
                        Aprobar
                    </button>
                    <button 
                        onclick="rejectSalon('${salon.id}')"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                    >
                        <i class="fas fa-times mr-2"></i>
                        Rechazar
                    </button>
                ` : `
                    <button 
                        onclick="toggleFeatured('${salon.id}', ${!salon.featured})"
                        class="px-4 py-2 ${salon.featured ? 'bg-gray-600' : 'bg-purple-600'} hover:bg-opacity-80 text-white rounded-lg text-sm font-medium"
                    >
                        <i class="fas fa-star mr-2"></i>
                        ${salon.featured ? 'Quitar Destacada' : 'Hacer Destacada'}
                    </button>
                `}
                <button 
                    onclick="editSalon('${salon.id}')"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                    <i class="fas fa-edit mr-2"></i>
                    Editar
                </button>
            </div>
        </div>
    `).join('');

    salonsList.innerHTML = salonsHTML;
}

// Approve salon
async function approveSalon(salonId) {
    if (!confirm('¿Estás seguro de que quieres aprobar esta peluquería?')) {
        return;
    }

    try {
        showLoading('Aprobando peluquería...');
        
        await window.FirebaseData.updateDocument('salons', salonId, {
            approved: true,
            featured: true,
            approvedAt: new Date(),
            approvedBy: currentUser.uid
        });
        
        showSuccess('Peluquería aprobada correctamente');
        await loadSalons();
        await loadDashboardStats();
        
    } catch (error) {
        console.error('Error approving salon:', error);
        showError('Error al aprobar la peluquería');
    } finally {
        hideLoading();
    }
}

// Reject salon
async function rejectSalon(salonId) {
    const reason = prompt('Motivo del rechazo (opcional):');
    if (reason === null) return; // User cancelled

    try {
        showLoading('Rechazando peluquería...');
        const result = await window.FirebaseData.rejectSalon(salonId, reason || 'Sin motivo especificado');
        
        if (result.success) {
            showSuccess('Peluquería rechazada');
            await loadSalons();
        } else {
            showError(result.error || 'Error al rechazar la peluquería');
        }
    } catch (error) {
        console.error('Error rejecting salon:', error);
        showError('Error al rechazar la peluquería');
    } finally {
        hideLoading();
    }
}

// Handle create salon form
async function handleCreateSalon(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('newSalonEmail').value.trim(),
        password: document.getElementById('newSalonPassword').value,
        contactName: document.getElementById('newSalonContactName').value.trim()
    };

    if (!validateCreateSalonForm(formData)) {
        return;
    }

    try {
        showLoading('Creando credenciales de peluquería...');

        // Create the salon account with minimal data
        const result = await window.FirebaseAuth.registerUser(
            formData.email,
            formData.password,
            {
                contactName: formData.contactName
            },
            'salon'
        );

        if (result.success) {
            showSuccess('Credenciales creadas correctamente');
            clearCreateSalonForm();
            
            // Show success message with next steps
            showNotification('✅ Cuenta creada. La peluquería debe completar su perfil al iniciar sesión.', 'success');
            
            // Check if admin needs to re-login due to user creation
            if (result.needsAdminRelogin) {
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                await loadSalons();
                await loadDashboardStats();
            }
        } else {
            showError(result.error || 'Error al crear las credenciales');
        }
    } catch (error) {
        console.error('Error creating salon credentials:', error);
        showError('Error al crear las credenciales');
    } finally {
        hideLoading();
    }
}

// Validate create salon form
function validateCreateSalonForm(formData) {
    if (!formData.email || !isValidEmail(formData.email)) {
        showError('Email válido es obligatorio');
        return false;
    }

    if (!formData.password || formData.password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    if (!formData.contactName) {
        showError('El nombre de contacto es obligatorio');
        return false;
    }

    return true;
}

// Clear create salon form
function clearCreateSalonForm() {
    document.getElementById('createSalonForm').reset();
}

// Load users data
async function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = `
        <div class="text-center py-8">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando usuarios...</p>
        </div>
    `;

    // For now, show a placeholder
    usersList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
            <i class="fas fa-users text-4xl mb-4"></i>
            <p>Funcionalidad en desarrollo</p>
            <p class="text-sm">La gestión de usuarios estará disponible próximamente</p>
        </div>
    `;
}

// Load settings
async function loadSettings() {
    try {
        const stats = await window.FirebaseData.getAppStats();
        
        document.getElementById('settingsTotalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('settingsTotalSalons').textContent = stats.totalSalons || 0;
        document.getElementById('settingsTotalReservations').textContent = stats.totalReservations || 0;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Utility functions
function formatDate(timestamp) {
    if (!timestamp) return 'No disponible';
    
    try {
        let date;
        if (timestamp.seconds) {
            // Firestore timestamp
            date = new Date(timestamp.seconds * 1000);
        } else {
            date = new Date(timestamp);
        }
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Loading and notification functions
function showLoading(message) {
    // Create or update loading modal
    let modal = document.getElementById('adminLoadingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adminLoadingModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                <div class="flex items-center">
                    <div class="loading mr-4"></div>
                    <div>
                        <div class="font-medium text-gray-900" id="adminLoadingText">Procesando...</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('adminLoadingText').textContent = message;
    modal.classList.remove('hidden');
}

function hideLoading() {
    const modal = document.getElementById('adminLoadingModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Placeholder functions for future features
function toggleFeatured(salonId, featured) {
    showNotification('Funcionalidad en desarrollo', 'info');
}

function editSalon(salonId) {
    showNotification('Funcionalidad en desarrollo', 'info');
}

function refreshAllData() {
    loadDashboardStats();
    loadSalons();
    showSuccess('Datos actualizados');
}

function exportData() {
    showNotification('Funcionalidad en desarrollo', 'info');
}

// Simplified - removed checkAdminDocument function as it's now inline 