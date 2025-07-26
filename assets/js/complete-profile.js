// Complete Profile JavaScript for PeluGo 2.0

let currentUser = null;
let salonData = null;

// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    initializeProfilePage();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            initializeProfilePage();
        }
    }, 100);
}

// Initialize profile page
function initializeProfilePage() {
    checkProfileAccess();
    initializeScheduleControls();
}

// Check if user has access to profile completion
async function checkProfileAccess() {
    try {
        console.log('🔐 Starting profile access check...');
        
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

        // Check if salon is already approved first
        if (salonData.approved === true) {
            console.log('✅ Salon is already approved, redirecting to index.html');
            window.location.href = 'index.html';
            return;
        }

        // Check if profile is incomplete
        if (salonData.profileStatus !== 'incomplete') {
            console.log('❌ Profile is not incomplete, redirecting...');
            
            if (salonData.profileStatus === 'pending_approval') {
                // Redirect to waiting page
                window.location.href = 'salon-waiting.html';
            } else {
                showAccessDenied();
            }
            return;
        }

        console.log('✅ Profile is incomplete, allowing access');
        await initializeProfileCompletion();

    } catch (error) {
        console.error('❌ Error checking profile access:', error);
        showAccessDenied();
    }
}

// Show access denied screen
function showAccessDenied() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('accessDenied').classList.remove('hidden');
}

// Initialize profile completion
async function initializeProfileCompletion() {
    try {
        // Hide loading screen
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('profileContent').classList.remove('hidden');

        // Update salon info
        updateSalonInfo();

        // Initialize event listeners
        initializeEventListeners();

        // Pre-fill any existing data
        prefillFormData();

    } catch (error) {
        console.error('Error initializing profile completion:', error);
        showError('Error al cargar el formulario');
    }
}

// Update salon info display
function updateSalonInfo() {
    const salonInfo = document.getElementById('salonInfo');
    if (currentUser && salonInfo) {
        const displayName = salonData.contactName || currentUser.displayName || currentUser.email;
        salonInfo.innerHTML = `
            <span class="font-medium">${displayName}</span>
            <span class="text-gray-500">Peluquería</span>
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

    // Complete profile form
    const completeProfileForm = document.getElementById('completeProfileForm');
    if (completeProfileForm) {
        completeProfileForm.addEventListener('submit', handleCompleteProfile);
        console.log('✅ Complete profile form listener added');
    }

    console.log('✅ All event listeners initialized');
}

// Pre-fill form with any existing data
function prefillFormData() {
    if (!salonData) return;

    // Fill basic info if available
    if (salonData.businessName) {
        document.getElementById('businessName').value = salonData.businessName;
    }
    if (salonData.address) {
        document.getElementById('address').value = salonData.address;
    }
    if (salonData.city) {
        document.getElementById('city').value = salonData.city;
    }
    if (salonData.phone) {
        document.getElementById('phone').value = salonData.phone;
    }
    if (salonData.description) {
        document.getElementById('description').value = salonData.description;
    }
    // Load schedule data (new format)
    if (salonData.schedule) {
        loadScheduleData(salonData.schedule);
    }
    if (salonData.website) {
        document.getElementById('website').value = salonData.website;
    }

    // Fill services checkboxes
    if (salonData.services && salonData.services.length > 0) {
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
        serviceCheckboxes.forEach(checkbox => {
            if (salonData.services.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

// Handle logout
async function handleLogout() {
    if (!confirm('¿Estás seguro de que quieres cerrar sesión? Perderás el progreso no guardado.')) {
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

// Handle complete profile form submission
async function handleCompleteProfile(e) {
    e.preventDefault();

    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }

    try {
        showLoading('Completando perfil...');
        
        // Prepare profile data
        const profileData = {
            businessName: formData.businessName,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            description: formData.description || '',
            services: formData.services,
            schedule: formData.schedule, // Now it's an object with detailed schedule
            website: formData.website || '',
            profileStatus: 'pending_approval',
            profileCompletedAt: new Date(),
            approved: false // Will need admin approval
        };

        // Update salon profile
        await window.FirebaseAPI.updateSalonProfile(currentUser.uid, profileData);
        
        console.log('✅ Profile completed successfully');
        
        // Show success and redirect
        showSuccess('¡Perfil completado correctamente!');
        
        setTimeout(() => {
            window.location.href = 'salon-waiting.html';
        }, 2000);

    } catch (error) {
        console.error('❌ Error completing profile:', error);
        showError('Error al completar el perfil. Inténtalo de nuevo.');
    } finally {
        hideLoading();
    }
}

// Collect form data
function collectFormData() {
    const services = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        services.push(checkbox.value);
    });

    return {
        businessName: document.getElementById('businessName').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value,
        phone: document.getElementById('phone').value.trim(),
        description: document.getElementById('description').value.trim(),
        services: services,
        schedule: collectScheduleData(), // New schedule format
        website: document.getElementById('website').value.trim(),
        acceptTerms: document.getElementById('acceptTerms').checked
    };
}

// Validate form data
function validateFormData(formData) {
    if (!formData.businessName) {
        showError('El nombre de la peluquería es obligatorio');
        document.getElementById('businessName').focus();
        return false;
    }

    if (!formData.address) {
        showError('La dirección es obligatoria');
        document.getElementById('address').focus();
        return false;
    }

    if (!formData.city) {
        showError('La ciudad es obligatoria');
        document.getElementById('city').focus();
        return false;
    }

    if (!formData.phone) {
        showError('El teléfono es obligatorio');
        document.getElementById('phone').focus();
        return false;
    }

    if (!isValidPhone(formData.phone)) {
        showError('El formato del teléfono no es válido');
        document.getElementById('phone').focus();
        return false;
    }

    if (formData.website && !isValidURL(formData.website)) {
        showError('El formato del sitio web no es válido');
        document.getElementById('website').focus();
        return false;
    }

    if (!formData.acceptTerms) {
        showError('Debes aceptar los términos y condiciones');
        document.getElementById('acceptTerms').focus();
        return false;
    }

    // Validate schedule
    const scheduleErrors = validateScheduleData(formData.schedule);
    if (scheduleErrors.length > 0) {
        showError(scheduleErrors[0]); // Show first error
        return false;
    }

    return true;
}

// Schedule Management Functions
function initializeScheduleControls() {
    console.log('📅 Initializing schedule controls...');
    
    // Add event listeners for day checkboxes
    document.querySelectorAll('.day-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const day = this.dataset.day;
            const dayRow = this.closest('.day-schedule-row');
            const scheduleTimes = dayRow.querySelector('.schedule-times');
            const breakTimes = dayRow.querySelector('.break-times');
            
            if (this.checked) {
                scheduleTimes.classList.remove('hidden');
                // Set default times
                const startInput = document.getElementById(`${day}-start`);
                const endInput = document.getElementById(`${day}-end`);
                if (!startInput.value) startInput.value = '09:00';
                if (!endInput.value) endInput.value = '18:00';
            } else {
                scheduleTimes.classList.add('hidden');
                breakTimes.classList.add('hidden');
                // Clear times
                document.getElementById(`${day}-start`).value = '';
                document.getElementById(`${day}-end`).value = '';
                document.getElementById(`${day}-break`).checked = false;
                document.getElementById(`${day}-break-start`).value = '';
                document.getElementById(`${day}-break-end`).value = '';
            }
        });
    });
    
    // Add event listeners for break checkboxes
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        const breakCheckbox = document.getElementById(`${day}-break`);
        if (breakCheckbox) {
            breakCheckbox.addEventListener('change', function() {
                const dayRow = this.closest('.day-schedule-row');
                const breakTimes = dayRow.querySelector('.break-times');
                if (this.checked) {
                    breakTimes.classList.remove('hidden');
                    // Set default break times
                    const breakStart = document.getElementById(`${day}-break-start`);
                    const breakEnd = document.getElementById(`${day}-break-end`);
                    if (!breakStart.value) breakStart.value = '14:00';
                    if (!breakEnd.value) breakEnd.value = '15:00';
                } else {
                    breakTimes.classList.add('hidden');
                    document.getElementById(`${day}-break-start`).value = '';
                    document.getElementById(`${day}-break-end`).value = '';
                }
            });
        }
    });
    
    // Quick action buttons
    const selectWorkWeekBtn = document.getElementById('selectWorkWeek');
    const selectFullWeekBtn = document.getElementById('selectFullWeek');
    const clearScheduleBtn = document.getElementById('clearSchedule');
    
    if (selectWorkWeekBtn) {
        selectWorkWeekBtn.addEventListener('click', () => setQuickSchedule('workweek'));
    }
    
    if (selectFullWeekBtn) {
        selectFullWeekBtn.addEventListener('click', () => setQuickSchedule('fullweek'));
    }
    
    if (clearScheduleBtn) {
        clearScheduleBtn.addEventListener('click', clearAllSchedule);
    }
}

function setQuickSchedule(type) {
    console.log(`📅 Setting quick schedule: ${type}`);
    
    // Clear all first
    clearAllSchedule();
    
    const days = type === 'workweek' ? 
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] :
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    days.forEach(day => {
        const checkbox = document.getElementById(`${day}-enabled`);
        const startInput = document.getElementById(`${day}-start`);
        const endInput = document.getElementById(`${day}-end`);
        
        if (checkbox && startInput && endInput) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change')); // Trigger the change event
            startInput.value = '09:00';
            endInput.value = '18:00';
        }
    });
}

function clearAllSchedule() {
    console.log('📅 Clearing all schedule...');
    
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        const checkbox = document.getElementById(`${day}-enabled`);
        if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change')); // Trigger the change event
        }
    });
}

function collectScheduleData() {
    const scheduleData = {};
    
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        const enabled = document.getElementById(`${day}-enabled`).checked;
        
        if (enabled) {
            const start = document.getElementById(`${day}-start`).value;
            const end = document.getElementById(`${day}-end`).value;
            const hasBreak = document.getElementById(`${day}-break`).checked;
            
            scheduleData[day] = {
                enabled: true,
                start: start,
                end: end,
                hasBreak: hasBreak
            };
            
            if (hasBreak) {
                scheduleData[day].breakStart = document.getElementById(`${day}-break-start`).value;
                scheduleData[day].breakEnd = document.getElementById(`${day}-break-end`).value;
            }
        } else {
            scheduleData[day] = {
                enabled: false
            };
        }
    });
    
    return scheduleData;
}

function loadScheduleData(scheduleData) {
    if (!scheduleData || typeof scheduleData === 'string') {
        // Handle old format (simple string) - don't load anything, let user set it up
        return;
    }
    
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        const dayData = scheduleData[day];
        if (dayData && dayData.enabled) {
            const checkbox = document.getElementById(`${day}-enabled`);
            const startInput = document.getElementById(`${day}-start`);
            const endInput = document.getElementById(`${day}-end`);
            const breakCheckbox = document.getElementById(`${day}-break`);
            
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
            
            if (startInput && dayData.start) {
                startInput.value = dayData.start;
            }
            
            if (endInput && dayData.end) {
                endInput.value = dayData.end;
            }
            
            if (breakCheckbox && dayData.hasBreak) {
                breakCheckbox.checked = true;
                breakCheckbox.dispatchEvent(new Event('change'));
                
                const breakStartInput = document.getElementById(`${day}-break-start`);
                const breakEndInput = document.getElementById(`${day}-break-end`);
                
                if (breakStartInput && dayData.breakStart) {
                    breakStartInput.value = dayData.breakStart;
                }
                
                if (breakEndInput && dayData.breakEnd) {
                    breakEndInput.value = dayData.breakEnd;
                }
            }
        }
    });
}

function validateScheduleData(scheduleData) {
    let hasAnyDay = false;
    let errors = [];
    
    Object.keys(scheduleData).forEach(day => {
        const dayData = scheduleData[day];
        if (dayData.enabled) {
            hasAnyDay = true;
            
            if (!dayData.start || !dayData.end) {
                errors.push(`Falta horario para ${getDayName(day)}`);
                return;
            }
            
            // Validate time format and logic
            if (dayData.start >= dayData.end) {
                errors.push(`Horario inválido para ${getDayName(day)}: la hora de fin debe ser posterior a la de inicio`);
            }
            
            if (dayData.hasBreak) {
                if (!dayData.breakStart || !dayData.breakEnd) {
                    errors.push(`Falta horario de descanso para ${getDayName(day)}`);
                    return;
                }
                
                if (dayData.breakStart >= dayData.breakEnd) {
                    errors.push(`Horario de descanso inválido para ${getDayName(day)}`);
                }
                
                // Validate break is within work hours
                if (dayData.breakStart < dayData.start || dayData.breakEnd > dayData.end) {
                    errors.push(`El descanso debe estar dentro del horario de trabajo para ${getDayName(day)}`);
                }
            }
        }
    });
    
    if (!hasAnyDay) {
        errors.push('Debe seleccionar al menos un día de trabajo');
    }
    
    return errors;
}

function getDayName(day) {
    const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes', 
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
    };
    return dayNames[day] || day;
}

// Utility functions
function isValidPhone(phone) {
    // Basic phone validation (Spanish format)
    const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Loading and notification functions
function showLoading(message) {
    let modal = document.getElementById('profileLoadingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profileLoadingModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                <div class="flex items-center">
                    <div class="loading mr-4"></div>
                    <div>
                        <div class="font-medium text-gray-900" id="profileLoadingText">Procesando...</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('profileLoadingText').textContent = message;
    modal.classList.remove('hidden');
}

function hideLoading() {
    const modal = document.getElementById('profileLoadingModal');
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
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 max-w-md ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
                 
    notification.innerHTML = `
        <div class="flex items-start">
            <i class="${icon} mr-2 mt-0.5"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
} 