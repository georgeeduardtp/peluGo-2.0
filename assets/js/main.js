// PeluGo 2.0 - Main JavaScript


// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    initializeMain();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            initializeMain();
        }
    }, 100);
}

function initializeMain() {
    // Mobile menu functionality
    initMobileMenu();
    
    // User authentication and menu
    initUserAuthentication();
    
    // Filter functionality
    initFilters();
    
    // Load featured salons
    loadFeaturedSalons();
    
    // PWA installation
    initPWA();
    
    // Search functionality
    initSearch();
    
    // Smooth scrolling
    initSmoothScrolling();
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animate hamburger icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
    }
}

// User Authentication and Menu
function initUserAuthentication() {
    console.log('🔐 Initializing user authentication...');
    
    // Initialize user menu functionality
    initUserMenus();
    
    // Listen to authentication state changes
    if (window.FirebaseAuth && window.FirebaseAuth.onAuthStateChanged) {
        window.FirebaseAuth.onAuthStateChanged(async (user) => {
            console.log('👤 Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
            await updateUIForLoggedUser(user);
        });
    } else {
        console.warn('FirebaseAuth not available for onAuthStateChanged');
    }
}

// Initialize user menu interactions
function initUserMenus() {
    // Desktop user menu
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutButton = document.getElementById('logoutButton');
    const adminLogoutButton = document.getElementById('adminLogoutButton');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Admin logout button
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', handleLogout);
    }
    
    // Mobile logout
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
}

// Update UI based on user authentication state
async function updateUIForLoggedUser(user) {
    const guestMenu = document.getElementById('guestMenu');
    const userMenu = document.getElementById('userMenu');
    const mobileGuestMenu = document.getElementById('mobileGuestMenu');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileUserOptions = document.getElementById('mobileUserOptions');
    
    if (user) {
        console.log('✅ User is logged in, updating UI...');
        
        // Hide guest menus
        if (guestMenu) guestMenu.classList.add('hidden');
        if (mobileGuestMenu) mobileGuestMenu.classList.add('hidden');
        
        // Show user menus
        if (userMenu) userMenu.classList.remove('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
        if (mobileUserOptions) mobileUserOptions.classList.remove('hidden');
        
        // Get user role and data
        const userInfo = await getUserRole(user.uid);
        console.log('👤 User info:', userInfo);
        
        // FIXED: Remove automatic redirects that cause infinite loops
        // The redirect logic is now handled properly in auth.js
        // Only update UI here, don't redirect
        
        updateUserMenuInfo(user, userInfo);
        
    } else {
        console.log('❌ No user logged in, showing guest UI...');
        
        // Show guest menus
        if (guestMenu) guestMenu.classList.remove('hidden');
        if (mobileGuestMenu) mobileGuestMenu.classList.remove('hidden');
        
        // Hide user menus
        if (userMenu) userMenu.classList.add('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
        if (mobileUserOptions) mobileUserOptions.classList.add('hidden');
    }
}

// Get user role from Firestore
async function getUserRole(uid) {
    try {
        console.log('🔍 Getting user role for UID:', uid);
        
        if (window.firebaseDb) {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js');
            
            // Check admin collection
            const adminDoc = await getDoc(doc(window.firebaseDb, 'admins', uid));
            if (adminDoc.exists()) {
                console.log('👑 User is admin');
                return { role: 'admin', data: adminDoc.data() };
            }
            
            // Check salon collection
            const salonDoc = await getDoc(doc(window.firebaseDb, 'salons', uid));
            if (salonDoc.exists()) {
                console.log('🏪 User is salon owner');
                return { role: 'salon', data: salonDoc.data() };
            }
            
            console.log('👤 User is regular user');
            return { role: 'user', data: null };
        }
        
        return { role: 'user', data: null };
    } catch (error) {
        console.error('❌ Error getting user role:', error);
        return { role: 'user', data: null };
    }
}

// Update user menu information
function updateUserMenuInfo(user, userInfo) {
    console.log('📝 Updating user menu info:', { user: user.displayName || user.email, userInfo });
    
    const role = userInfo.role;
    const userData = userInfo.data;
    
    // Desktop menu
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userIcon = document.getElementById('userIcon');
    
    // Mobile menu
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileUserRole = document.getElementById('mobileUserRole');
    const mobileUserIcon = document.getElementById('mobileUserIcon');
    const mobileUserIconMain = document.getElementById('mobileUserIconMain');
    
    // Update names
    let displayName = user.displayName || user.email.split('@')[0];
    
    // For salons, try to get business name if available
    if (role === 'salon' && userData && userData.businessName) {
        displayName = userData.businessName;
    }
    
    if (userName) userName.textContent = displayName;
    if (mobileUserName) mobileUserName.textContent = displayName;
    
    // Update roles and icons
    let roleText = 'Usuario';
    let iconClass = 'fas fa-user';
    
    if (role === 'admin') {
        roleText = 'Administrador';
        iconClass = 'fas fa-crown';
    } else if (role === 'salon') {
        roleText = 'Peluquería';
        iconClass = 'fas fa-cut';
        
        // Add status indicator for salons
        if (userData) {
            const profileStatus = userData.profileStatus || 'incomplete';
            if (profileStatus === 'pending_approval') {
                roleText += ' (Pendiente)';
            } else if (profileStatus === 'approved') {
                roleText += ' (Aprobada)';
            }
        }
    }
    
    if (userRole) userRole.textContent = roleText;
    if (mobileUserRole) mobileUserRole.textContent = roleText;
    if (userIcon) userIcon.className = iconClass + ' text-white text-sm';
    if (mobileUserIcon) mobileUserIcon.className = iconClass + ' text-white text-sm';
    if (mobileUserIconMain) mobileUserIconMain.className = iconClass + ' text-white';
    
    // Show appropriate menu options
    showMenuOptionsForRole(role, userData);
    
    // Update mobile options
    updateMobileUserOptions(role, userData);
}

// Show appropriate menu options based on role
function showMenuOptionsForRole(role, userData = null) {
    const userOptions = document.getElementById('userOptions');
    const salonOptions = document.getElementById('salonOptions');
    const adminOptions = document.getElementById('adminOptions');
    const commonOptions = document.getElementById('commonOptions');
    
    // Hide all first
    if (userOptions) userOptions.classList.add('hidden');
    if (salonOptions) salonOptions.classList.add('hidden');
    if (adminOptions) adminOptions.classList.add('hidden');
    if (commonOptions) commonOptions.classList.add('hidden');
    
    // Show appropriate options
    if (role === 'admin') {
        if (adminOptions) adminOptions.classList.remove('hidden');
        // Admin only shows its own menu, no common options
    } else if (role === 'salon') {
        if (salonOptions) salonOptions.classList.remove('hidden');
        if (commonOptions) commonOptions.classList.remove('hidden'); // Show common options
        
        // Update salon options based on profile status
        updateSalonMenuOptions(userData);
    } else {
        if (userOptions) userOptions.classList.remove('hidden');
        if (commonOptions) commonOptions.classList.remove('hidden'); // Show common options
    }
}

// Update salon menu options based on profile status
function updateSalonMenuOptions(userData) {
    const salonOptions = document.getElementById('salonOptions');
    if (!salonOptions || !userData) return;
    
    const profileStatus = userData.profileStatus || 'incomplete';
    
    // Update salon options dynamically
    let salonOptionsHTML = '';
    
    if (profileStatus === 'incomplete') {
        salonOptionsHTML = `
            <a href="complete-profile.html" class="block px-4 py-2 text-sm text-purple-400 hover:bg-purple-900 font-medium">
                <i class="fas fa-edit mr-2"></i>
                Completar Perfil
            </a>
        `;
    } else if (profileStatus === 'pending_approval') {
        salonOptionsHTML = `
            <a href="salon-waiting.html" class="block px-4 py-2 text-sm text-orange-400 hover:bg-orange-900 font-medium">
                <i class="fas fa-clock mr-2"></i>
                Estado de Aprobación
            </a>
        `;
    } else if (profileStatus === 'approved') {
        salonOptionsHTML = `
            <a href="salon-settings.html" class="block px-4 py-2 text-sm text-blue-400 hover:bg-blue-900 font-medium">
                <i class="fas fa-cog mr-2"></i>
                Configuración
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                <i class="fas fa-store mr-2"></i>
                Mi Peluquería
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                <i class="fas fa-calendar-check mr-2"></i>
                Reservas Recibidas
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                <i class="fas fa-star mr-2"></i>
                Reseñas
            </a>
        `;
    }
    
    salonOptions.innerHTML = salonOptionsHTML;
}

// Update mobile user options
function updateMobileUserOptions(role, userData = null) {
    const mobileUserOptionsList = document.getElementById('mobileUserOptionsList');
    if (!mobileUserOptionsList) return;
    
    let optionsHTML = '';
    
    if (role === 'admin') {
        optionsHTML = `
            <a href="admin.html" class="block text-gray-300 font-medium py-2">
                <i class="fas fa-crown mr-2"></i>Panel de Admin
            </a>
        `;
    } else if (role === 'salon') {
        const profileStatus = userData ? (userData.profileStatus || 'incomplete') : 'incomplete';
        
        if (profileStatus === 'incomplete') {
            optionsHTML = `
                <a href="complete-profile.html" class="block text-purple-400 font-medium py-2">
                    <i class="fas fa-edit mr-2"></i>Completar Perfil
                </a>
            `;
        } else if (profileStatus === 'pending_approval') {
            optionsHTML = `
                <a href="salon-waiting.html" class="block text-orange-400 font-medium py-2">
                    <i class="fas fa-clock mr-2"></i>Estado de Aprobación
                </a>
            `;
        } else if (profileStatus === 'approved') {
            optionsHTML = `
                <a href="salon-settings.html" class="block text-blue-400 font-medium py-2">
                    <i class="fas fa-cog mr-2"></i>Configuración
                </a>
                <a href="#" class="block text-gray-300 font-medium py-2">
                    <i class="fas fa-store mr-2"></i>Mi Peluquería
                </a>
                <a href="#" class="block text-gray-300 py-2">
                    <i class="fas fa-calendar-check mr-2"></i>Reservas Recibidas
                </a>
                <a href="#" class="block text-gray-300 py-2">
                    <i class="fas fa-star mr-2"></i>Reseñas
                </a>
            `;
        }
    } else {
        optionsHTML = `
            <a href="#" class="block text-gray-300 py-2">
                <i class="fas fa-user mr-2"></i>Mi Perfil
            </a>
            <a href="#" class="block text-gray-300 py-2">
                <i class="fas fa-calendar-alt mr-2"></i>Mis Reservas
            </a>
        `;
    }
    
    // Add common options only for non-admin users
    if (role !== 'admin') {
        optionsHTML += `
            <a href="#" class="block text-gray-300 py-2">
                <i class="fas fa-cog mr-2"></i>Configuración
            </a>
        `;
    }
    
    mobileUserOptionsList.innerHTML = optionsHTML;
}

// Handle logout
async function handleLogout() {
    if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        return;
    }
    
    try {
        console.log('👋 Logging out user...');
        
        if (window.FirebaseAuth && window.FirebaseAuth.signOut) {
            await window.FirebaseAuth.signOut();
            console.log('✅ User logged out successfully');
            
            // Redirect to home or refresh
            window.location.reload();
        }
    } catch (error) {
        console.error('❌ Error during logout:', error);
        alert('Error al cerrar sesión. Inténtalo de nuevo.');
    }
}

// Filter Functionality
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-purple-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // Add active class to clicked button
            this.classList.add('active', 'bg-purple-600', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Filter salons based on selected city
            const filterValue = this.textContent.trim();
            filterSalons(filterValue);
        });
    });
}

// Load Featured Salons
async function loadFeaturedSalons() {
    const grid = document.getElementById('peluqueriasGrid');
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando peluquerías destacadas...</p>
        </div>
    `;
    
    try {
        const salons = await getFeaturedSalons();
        renderSalons(salons);
        updateStats(salons);
    } catch (error) {
        console.error('Error loading salons:', error);
        showEmptyState();
        updateStats([]);
    }
}

// Get Featured Salons Data from Firebase
async function getFeaturedSalons() {
    try {
        // Wait for Firebase to be available
        if (window.FirebaseData && window.FirebaseData.getFeaturedSalons) {
            return await window.FirebaseData.getFeaturedSalons();
        } else {
            // Firebase not ready yet, return empty array
            console.log('Firebase not ready yet, returning empty array');
            return [];
        }
    } catch (error) {
        console.error('Error fetching salons:', error);
        return [];
    }
}

// Render Salons
function renderSalons(salons) {
    const grid = document.getElementById('peluqueriasGrid');
    if (!grid) return;
    
    // Check if there are no salons
    if (!salons || salons.length === 0) {
        showEmptyState();
        return;
    }
    
    const salonCards = salons.map(salon => `
        <div class="salon-card bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden cursor-pointer" data-city="${salon.city}">
            <div class="relative">
                <img src="${salon.image}" alt="${salon.name}" class="w-full h-48 object-cover">
                <div class="absolute top-4 right-4 bg-gray-800 bg-opacity-90 px-2 py-1 rounded-full border border-gray-600">
                    <div class="star-rating">
                        ${generateStars(salon.rating)}
                        <span class="ml-1 text-sm font-medium text-gray-300">${salon.rating}</span>
                    </div>
                </div>
                ${salon.featured ? '<div class="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full text-xs font-bold">Destacada</div>' : ''}
            </div>
            
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-100">${salon.name}</h3>
                    <span class="text-blue-400 font-bold">${salon.price}</span>
                </div>
                
                <div class="flex items-center text-gray-400 mb-3">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    <span>${salon.city}</span>
                    <span class="mx-2">•</span>
                    <span>${salon.reviews} reseñas</span>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    ${salon.services.map(service => `
                        <span class="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            ${service}
                        </span>
                    `).join('')}
                </div>
                
                <button class="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Reservar ahora
                </button>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = salonCards;
    
    // Show filter buttons and "Ver más" button when there are salons
    showUIElements();
    
    // Initialize scroll animations after rendering
    setTimeout(observeElements, 100);
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star star"></i>';
    }
    
    return starsHTML;
}

// Filter Salons
function filterSalons(city) {
    const salonCards = document.querySelectorAll('.salon-card');
    
    salonCards.forEach(card => {
        const cardCity = card.dataset.city;
        
        if (city === 'Todas' || cardCity === city) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// PWA Installation
function initPWA() {
    let deferredPrompt;
    const installBtn = document.getElementById('installApp');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    });
    
    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installation accepted');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }
}

// Search Functionality
function initSearch() {
    const searchBtn = document.querySelector('button[type="submit"], button:has(.fa-search)');
    const cityInput = document.getElementById('citySearch');
    
    if (searchBtn && cityInput) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const city = cityInput.value.trim();
            
            if (city) {
                // Simulate search
                console.log('Buscando peluquerías en:', city);
                
                // Show loading state
                searchBtn.innerHTML = '<div class="loading mr-2"></div>Buscando...';
                
                setTimeout(() => {
                    searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Buscar';
                    // Here you would typically redirect to search results or update the page
                    alert(`Mostrando resultados para: ${city}`);
                }, 1500);
            }
        });
        
        // Enter key support
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility Functions
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

// Animation on scroll
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.salon-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Show empty state when no salons are available
function showEmptyState() {
    const grid = document.getElementById('peluqueriasGrid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="col-span-full text-center py-16">
            <div class="max-w-md mx-auto">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-store text-4xl text-blue-400"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-100 mb-4">
                    ¡Pronto tendremos peluquerías!
                </h3>
                <p class="text-gray-400 mb-6 leading-relaxed">
                    Estamos trabajando para traerte las mejores peluquerías de España. 
                    Las peluquerías destacadas aparecerán aquí cuando nuestro equipo las apruebe.
                </p>
                <div class="space-y-3 text-sm text-gray-500">
                    <div class="flex items-center justify-center">
                        <i class="fas fa-check-circle text-green-400 mr-2"></i>
                        <span>¿Tienes una peluquería? <a href="auth.html?tab=register&type=salon" class="text-blue-400 hover:text-blue-300 font-medium">Regístrala aquí</a></span>
                    </div>
                    <div class="flex items-center justify-center">
                        <i class="fas fa-bell text-blue-400 mr-2"></i>
                        <span>Te notificaremos cuando haya nuevas peluquerías</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Hide the filter buttons when there are no salons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        const filterContainer = filterButtons[0].parentElement;
        if (filterContainer) {
            filterContainer.style.display = 'none';
        }
    }
    
    // Hide the "Ver más" button
    const verMasBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Ver más peluquerías')
    );
    if (verMasBtn) {
        verMasBtn.style.display = 'none';
    }
}

// Show UI elements when there are salons
function showUIElements() {
    // Show filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        const filterContainer = filterButtons[0].parentElement;
        if (filterContainer) {
            filterContainer.style.display = 'flex';
        }
    }
    
    // Show "Ver más" button
    const verMasBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Ver más peluquerías')
    );
    if (verMasBtn) {
        verMasBtn.style.display = 'inline-flex';
    }
}

// Utility function to refresh salon data (for admin use)
async function refreshSalons() {
    await loadFeaturedSalons();
}

// Update platform statistics
function updateStats(salons = []) {
    const salonCountEl = document.getElementById('salonCount');
    const userCountEl = document.getElementById('userCount');
    const averageRatingEl = document.getElementById('averageRating');
    
    // Update salon count
    if (salonCountEl) {
        salonCountEl.textContent = salons.length;
    }
    
    // Get comprehensive stats from Firebase
    if (window.FirebaseData && window.FirebaseData.getAppStats) {
        window.FirebaseData.getAppStats().then(stats => {
            if (userCountEl) {
                userCountEl.textContent = stats.totalUsers;
            }
        }).catch(error => {
            console.error('Error getting app stats:', error);
            if (userCountEl) {
                userCountEl.textContent = '0';
            }
        });
    }
    
    // Calculate average rating
    if (averageRatingEl) {
        if (salons.length > 0) {
            const salonsWithRating = salons.filter(salon => salon.rating && salon.rating > 0);
            if (salonsWithRating.length > 0) {
                const avgRating = salonsWithRating.reduce((sum, salon) => sum + salon.rating, 0) / salonsWithRating.length;
                averageRatingEl.textContent = avgRating.toFixed(1) + '★';
            } else {
                averageRatingEl.textContent = '-';
            }
        } else {
            averageRatingEl.textContent = '-';
        }
    }
}

// Redirect to auth page
function redirectToAuth() {
    window.location.href = 'auth.html';
}

// Initialize Firebase listeners when available
function initializeFirebaseListeners() {
    if (window.FirebaseData && window.FirebaseData.listenToSalonUpdates) {
        console.log('Setting up real-time salon updates...');
        window.FirebaseData.listenToSalonUpdates();
    }
}

// Call initial load and setup Firebase listeners
setTimeout(() => {
    loadFeaturedSalons();
    initializeFirebaseListeners();
}, 1000);

// Add click handler to login button
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', redirectToAuth);
    }
}); 