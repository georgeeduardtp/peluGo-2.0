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
        await loadWebRegistrations();

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
        } else if (tabName === 'web-registrations') {
            console.log('🔄 Loading web registrations data...');
            loadWebRegistrations();
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
                <p class="text-gray-400">Cargando peluquerías...</p>
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
            <div class="text-center py-8 text-red-400">
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
        btn.classList.remove('bg-blue-700', 'text-white');
        btn.classList.add('bg-gray-600', 'text-gray-300');
    });

    const activeFilter = document.querySelector(`[data-filter="${filter}"]`);
    if (activeFilter) {
        activeFilter.classList.add('bg-blue-700', 'text-white');
        activeFilter.classList.remove('bg-gray-600', 'text-gray-300');
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
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-store text-4xl mb-4"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    const salonsHTML = salons.map(salon => `
        <div class="border border-gray-600 rounded-lg p-6 mb-4 bg-gray-800">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-100">${salon.businessName || salon.name}</h3>
                    <p class="text-gray-300">${salon.contactName || salon.displayName}</p>
                    <p class="text-sm text-gray-400">${salon.email}</p>
                </div>
                <div class="flex items-center space-x-2">
                    ${salon.approved ? 
                        '<span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Aprobada</span>' :
                        '<span class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Pendiente</span>'
                    }
                    ${salon.featured ? 
                        '<span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Destacada</span>' :
                        ''
                    }
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-300"><strong>Dirección:</strong> ${salon.address || 'No especificada'}</p>
                    <p class="text-sm text-gray-300"><strong>Ciudad:</strong> ${salon.city || 'No especificada'}</p>
                    <p class="text-sm text-gray-300"><strong>Teléfono:</strong> ${salon.phone || 'No especificado'}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-300"><strong>Rating:</strong> ${salon.rating || 0}/5</p>
                    <p class="text-sm text-gray-300"><strong>Reseñas:</strong> ${salon.reviewCount || 0}</p>
                    <p class="text-sm text-gray-300"><strong>Creada:</strong> ${formatDate(salon.createdAt)}</p>
                </div>
            </div>

            ${salon.description ? `
                <div class="mb-4">
                    <p class="text-sm text-gray-300"><strong>Descripción:</strong></p>
                    <p class="text-sm text-gray-400">${salon.description}</p>
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
                <button 
                    onclick="deleteSalon('${salon.id}', '${salon.businessName || salon.name}')"
                    class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm font-medium"
                >
                    <i class="fas fa-trash mr-2"></i>
                    Eliminar
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
            profileStatus: 'approved', // 🆕 CRÍTICO: Actualizar profileStatus
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
        
        // Wait for Chart.js to be available before loading charts
        await waitForChartJS();
        
        // Load and create charts
        await loadMonthlyCharts();
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Wait for Chart.js to be available
function waitForChartJS() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        const checkChartJS = () => {
            attempts++;
            
            if (typeof Chart !== 'undefined') {
                console.log('✅ Chart.js is available');
                resolve();
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.error('❌ Chart.js failed to load after 5 seconds');
                reject(new Error('Chart.js not available'));
                return;
            }
            
            console.log(`⏳ Waiting for Chart.js... (attempt ${attempts}/${maxAttempts})`);
            setTimeout(checkChartJS, 100);
        };
        
        checkChartJS();
    });
}

// Load monthly charts data and create charts
async function loadMonthlyCharts() {
    try {
        console.log('📊 Loading monthly charts data...');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js is not loaded');
            showError('Chart.js no está cargado. Recarga la página.');
            return;
        }
        
        // Get users monthly data
        let usersMonthlyData;
        try {
            usersMonthlyData = await getUsersMonthlyData();
            console.log('✅ Users monthly data loaded:', usersMonthlyData);
        } catch (error) {
            console.error('❌ Error loading users data:', error);
            usersMonthlyData = { labels: [], data: [], total: 0 };
        }
        
        // Get salons monthly data
        let salonsMonthlyData;
        try {
            salonsMonthlyData = await getSalonsMonthlyData();
            console.log('✅ Salons monthly data loaded:', salonsMonthlyData);
        } catch (error) {
            console.error('❌ Error loading salons data:', error);
            salonsMonthlyData = { labels: [], data: [], total: 0 };
        }
        
        // Create charts even if data is empty
        createUsersMonthlyChart(usersMonthlyData);
        createSalonsMonthlyChart(salonsMonthlyData);
        
        console.log('✅ Monthly charts loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading monthly charts:', error);
        showError('Error al cargar las gráficas: ' + error.message);
    }
}

// Get users monthly registration data
async function getUsersMonthlyData() {
    try {
        console.log('🔍 Fetching users data from Firestore...');
        const users = await window.FirebaseData.getCollection('users');
        console.log(`📊 Found ${users.length} users in database`);
        
        // Group users by month starting from July 2025
        const monthlyData = {};
        const startDate = new Date(2025, 6, 1); // July 2025 (month is 0-indexed)
        const currentDate = new Date();
        const months = [];
        
        // Generate 12 months from July 2025 (including future months)
        let currentMonth = new Date(startDate);
        for (let i = 0; i < 12; i++) {
            const monthKey = currentMonth.toISOString().slice(0, 7); // YYYY-MM format
            const monthLabel = currentMonth.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            
            monthlyData[monthKey] = 0;
            months.push({ key: monthKey, label: monthLabel });
            
            // Move to next month
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        // Count users by month
        let validUsers = 0;
        users.forEach(user => {
            if (user.createdAt) {
                let userDate;
                try {
                    if (user.createdAt.seconds) {
                        // Firestore timestamp
                        userDate = new Date(user.createdAt.seconds * 1000);
                    } else {
                        userDate = new Date(user.createdAt);
                    }
                    
                    const monthKey = userDate.toISOString().slice(0, 7);
                    if (monthlyData.hasOwnProperty(monthKey)) {
                        monthlyData[monthKey]++;
                        validUsers++;
                    }
                } catch (dateError) {
                    console.warn('⚠️ Invalid date for user:', user.email, dateError);
                }
            }
        });
        
        console.log(`✅ Processed ${validUsers} users with valid dates`);
        
        // Prepare data for chart
        const labels = months.map(m => m.label);
        const data = months.map(m => monthlyData[m.key]);
        
        // Calculate cumulative total (all users ever registered)
        const total = users.length;
        
        document.getElementById('usersChartTotal').textContent = total;
        
        return { labels, data, total };
        
    } catch (error) {
        console.error('❌ Error getting users monthly data:', error);
        // Return empty data structure with 12 months from July 2025
        const startDate = new Date(2025, 6, 1); // July 2025
        const months = [];
        
        let currentMonth = new Date(startDate);
        for (let i = 0; i < 12; i++) {
            const monthLabel = currentMonth.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            months.push(monthLabel);
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        return { labels: months, data: new Array(months.length).fill(0), total: 0 };
    }
}

// Get salons monthly activation data
async function getSalonsMonthlyData() {
    try {
        console.log('🔍 Fetching salons data from Firestore...');
        const salons = await window.FirebaseData.getCollection('salons');
        console.log(`📊 Found ${salons.length} salons in database`);
        
        // Group approved salons by month starting from July 2025
        const monthlyData = {};
        const startDate = new Date(2025, 6, 1); // July 2025 (month is 0-indexed)
        const currentDate = new Date();
        const months = [];
        
        // Generate 12 months from July 2025 (including future months)
        let currentMonth = new Date(startDate);
        for (let i = 0; i < 12; i++) {
            const monthKey = currentMonth.toISOString().slice(0, 7); // YYYY-MM format
            const monthLabel = currentMonth.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            
            monthlyData[monthKey] = 0;
            months.push({ key: monthKey, label: monthLabel });
            
            // Move to next month
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        // Count approved salons by approval month
        let validSalons = 0;
        salons.forEach(salon => {
            if (salon.approved && salon.approvedAt) {
                let approvalDate;
                try {
                    if (salon.approvedAt.seconds) {
                        // Firestore timestamp
                        approvalDate = new Date(salon.approvedAt.seconds * 1000);
                    } else {
                        approvalDate = new Date(salon.approvedAt);
                    }
                    
                    const monthKey = approvalDate.toISOString().slice(0, 7);
                    if (monthlyData.hasOwnProperty(monthKey)) {
                        monthlyData[monthKey]++;
                        validSalons++;
                    }
                } catch (dateError) {
                    console.warn('⚠️ Invalid approval date for salon:', salon.businessName || salon.email, dateError);
                }
            }
        });
        
        console.log(`✅ Processed ${validSalons} approved salons with valid approval dates`);
        
        // Prepare data for chart
        const labels = months.map(m => m.label);
        const data = months.map(m => monthlyData[m.key]);
        
        // Calculate cumulative total (all approved salons ever)
        const approvedSalons = salons.filter(salon => salon.approved);
        const total = approvedSalons.length;
        
        document.getElementById('salonsChartTotal').textContent = total;
        
        return { labels, data, total };
        
    } catch (error) {
        console.error('❌ Error getting salons monthly data:', error);
        // Return empty data structure with 12 months from July 2025
        const startDate = new Date(2025, 6, 1); // July 2025
        const months = [];
        
        let currentMonth = new Date(startDate);
        for (let i = 0; i < 12; i++) {
            const monthLabel = currentMonth.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            months.push(monthLabel);
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        return { labels: months, data: new Array(months.length).fill(0), total: 0 };
    }
}

// Create users monthly chart
function createUsersMonthlyChart(chartData) {
    const ctx = document.getElementById('usersMonthlyChart');
    if (!ctx) {
        console.error('❌ Canvas element for users chart not found');
        return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded');
        return;
    }
    
    // Destroy existing chart if it exists and is a valid Chart instance
    if (window.usersMonthlyChart && typeof window.usersMonthlyChart.destroy === 'function') {
        window.usersMonthlyChart.destroy();
    }
    
    try {
        window.usersMonthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Usuarios Registrados',
                    data: chartData.data,
                    borderColor: 'rgb(147, 51, 234)',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(147, 51, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgb(147, 51, 234)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} usuarios`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#9CA3AF',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#9CA3AF',
                            stepSize: 1
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        console.log('✅ Users monthly chart created successfully');
        
    } catch (error) {
        console.error('❌ Error creating users monthly chart:', error);
    }
}

// Create salons monthly chart
function createSalonsMonthlyChart(chartData) {
    const ctx = document.getElementById('salonsMonthlyChart');
    if (!ctx) {
        console.error('❌ Canvas element for salons chart not found');
        return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded');
        return;
    }
    
    // Destroy existing chart if it exists and is a valid Chart instance
    if (window.salonsMonthlyChart && typeof window.salonsMonthlyChart.destroy === 'function') {
        window.salonsMonthlyChart.destroy();
    }
    
    try {
        window.salonsMonthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Peluquerías Activas',
                    data: chartData.data,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                    hoverBackgroundColor: 'rgba(34, 197, 94, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgb(34, 197, 94)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} peluquerías`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#9CA3AF',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#9CA3AF',
                            stepSize: 1
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        console.log('✅ Salons monthly chart created successfully');
        
    } catch (error) {
        console.error('❌ Error creating salons monthly chart:', error);
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

// Delete salon completely (document + auth account)
async function deleteSalon(salonId, salonName) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la peluquería "${salonName}"?\n\n⚠️ Esta acción eliminará:\n• Todos los datos de la peluquería\n• La cuenta de autenticación\n• Reservas y reseñas asociadas\n\nEsta acción NO se puede deshacer.`)) {
        return;
    }

    try {
        showLoading('Eliminando peluquería...');
        
        // First, get the salon data to get the email for auth deletion
        const salonData = await window.FirebaseData.getDocument('salons', salonId);
        
        if (!salonData) {
            throw new Error('No se encontraron datos de la peluquería');
        }

        console.log('🗑️ Deleting salon:', { id: salonId, name: salonName, email: salonData.email });

        // Delete the Firestore document
        await window.FirebaseData.deleteDocument('salons', salonId);
        console.log('✅ Firestore document deleted');

        // Delete the authentication account if email exists
        if (salonData.email) {
            try {
                await window.FirebaseAuth.deleteUser(salonData.email);
                console.log('✅ Authentication account deleted');
            } catch (authError) {
                console.warn('⚠️ Could not delete auth account:', authError);
                // Continue even if auth deletion fails
            }
        }

        // Update city count if city exists
        if (salonData.city) {
            try {
                await window.FirebaseData.updateCityCount(salonData.city, -1);
                console.log('✅ City count updated');
            } catch (cityError) {
                console.warn('⚠️ Could not update city count:', cityError);
            }
        }

        // Update app stats
        try {
            await window.FirebaseData.updateAppStats('salon', -1);
            console.log('✅ App stats updated');
        } catch (statsError) {
            console.warn('⚠️ Could not update app stats:', statsError);
        }

        showSuccess(`Peluquería "${salonName}" eliminada correctamente`);
        
        // Refresh data
        await loadSalons();
        await loadDashboardStats();
        
    } catch (error) {
        console.error('❌ Error deleting salon:', error);
        showError(`Error al eliminar la peluquería: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function refreshAllData() {
    loadDashboardStats();
    loadSalons();
    loadWebRegistrations();
    showSuccess('Datos actualizados');
}

function exportData() {
    showNotification('Funcionalidad en desarrollo', 'info');
}

// Load web registrations
async function loadWebRegistrations() {
    try {
        console.log('📋 Loading web registrations...');
        
        const registrations = await window.FirebaseData.getWebRegistrations();
        
        renderWebRegistrations(registrations);
        
    } catch (error) {
        console.error('❌ Error loading web registrations:', error);
        showError('Error al cargar los registros web');
    }
}

// Render web registrations
function renderWebRegistrations(registrations) {
    const container = document.getElementById('webRegistrationsList');
    
    if (!registrations || registrations.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-inbox text-4xl text-gray-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-300 mb-2">No hay registros web</h3>
                <p class="text-gray-400">Aún no se han recibido solicitudes de registro desde el formulario web.</p>
            </div>
        `;
        return;
    }
    
    const registrationsHTML = registrations.map(registration => {
        const registrationDate = registration.registrationDate ? 
            new Date(registration.registrationDate.seconds * 1000).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Fecha no disponible';
        
        return `
            <div class="bg-gray-700 rounded-lg p-6 mb-4 border border-gray-600">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-100 mb-2">${registration.businessName || 'Sin nombre'}</h3>
                        <p class="text-gray-400 text-sm">${registration.businessType || 'Tipo no especificado'}</p>
                    </div>
                    <div class="text-right">
                        <span class="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2">Nuevo</span>
                        <p class="text-gray-400 text-sm">${registrationDate}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 class="font-medium text-gray-300 mb-2">Información de Contacto</h4>
                        <div class="space-y-1 text-sm text-gray-400">
                            <p><i class="fas fa-user mr-2"></i>${registration.contactName || 'No especificado'}</p>
                            <p><i class="fas fa-envelope mr-2"></i>${registration.contactEmail || 'No especificado'}</p>
                            <p><i class="fas fa-phone mr-2"></i>${registration.phone || 'No especificado'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-medium text-gray-300 mb-2">Ubicación</h4>
                        <div class="space-y-1 text-sm text-gray-400">
                            <p><i class="fas fa-map-marker-alt mr-2"></i>${registration.address || 'No especificada'}</p>
                            <p><i class="fas fa-city mr-2"></i>${registration.city || 'No especificada'}, ${registration.province || 'No especificada'}</p>
                            <p><i class="fas fa-mail-bulk mr-2"></i>${registration.postalCode || 'No especificado'}</p>
                        </div>
                    </div>
                </div>
                
                ${registration.description ? `
                    <div class="mb-4">
                        <h4 class="font-medium text-gray-300 mb-2">Descripción</h4>
                        <p class="text-gray-400 text-sm">${registration.description}</p>
                    </div>
                ` : ''}
                
                ${registration.website ? `
                    <div class="mb-4">
                        <h4 class="font-medium text-gray-300 mb-2">Sitio Web</h4>
                        <a href="${registration.website}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">
                            <i class="fas fa-external-link-alt mr-1"></i>${registration.website}
                        </a>
                    </div>
                ` : ''}
                
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-600">
                    <button 
                        onclick="deleteWebRegistration('${registration.id}', '${registration.businessName || 'esta peluquería'}')"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <i class="fas fa-trash mr-2"></i>Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = registrationsHTML;
}

// Delete web registration
async function deleteWebRegistration(registrationId, businessName) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el registro de "${businessName}"? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        showLoading('Eliminando registro...');
        
        await window.FirebaseData.deleteWebRegistration(registrationId);
        
        hideLoading();
        showSuccess('Registro eliminado correctamente');
        
        // Reload web registrations
        await loadWebRegistrations();
        
    } catch (error) {
        console.error('❌ Error deleting web registration:', error);
        hideLoading();
        showError('Error al eliminar el registro');
    }
}

// Simplified - removed checkAdminDocument function as it's now inline 