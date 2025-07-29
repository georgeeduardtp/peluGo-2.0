// Salon Settings JavaScript for PeluGo 2.0

let currentUser = null;
let salonData = null;

// Wait for Firebase to be ready before starting
if (window.firebaseReady) {
    initializeSettingsPage();
} else {
    // Wait for Firebase to be ready
    const checkFirebaseReady = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebaseReady);
            initializeSettingsPage();
        }
    }, 100);
}

// Initialize settings page
function initializeSettingsPage() {
    checkSettingsAccess();
    initializeScheduleControls();
}

// Check if user has access to settings page
async function checkSettingsAccess() {
    try {
        console.log('🔐 Starting settings access check...');
        
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

        // Check if salon is approved
        if (salonData.approved !== true) {
            console.log('❌ Salon is not approved');
            showAccessDenied();
            return;
        }

        console.log('✅ Salon is approved, allowing access to settings');
        await initializeSettings();

    } catch (error) {
        console.error('❌ Error checking settings access:', error);
        showAccessDenied();
    }
}

// Show access denied screen
function showAccessDenied() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('accessDenied').classList.remove('hidden');
}

// Initialize settings
async function initializeSettings() {
    console.log('🚀 Inicializando configuración...');
    try {
        // Hide loading screen
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('settingsContent').classList.remove('hidden');
        console.log('✅ Pantallas configuradas');

        // Update salon info
        updateSalonInfo();
        console.log('✅ Información de peluquería actualizada');

        // Initialize event listeners
        console.log('🔗 Configurando event listeners...');
        initializeEventListeners();

        // Load current data into form
        console.log('📝 Cargando datos actuales...');
        loadCurrentData();
        console.log('✅ Inicialización completada');

    } catch (error) {
        console.error('❌ Error initializing settings:', error);
        showError('Error al cargar la configuración');
    }
}

// Update salon info in navigation
function updateSalonInfo() {
    const salonInfo = document.getElementById('salonInfo');
    if (salonInfo && salonData) {
        salonInfo.innerHTML = `
            <span class="text-gray-300">${salonData.businessName || 'Peluquería'}</span>
            <span class="text-gray-500 mx-2">•</span>
            <span class="text-gray-400">${salonData.city || 'Ciudad'}</span>
        `;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    console.log('🔗 Inicializando event listeners...');
    
    // Save button click (now outside the form)
    const saveButton = document.getElementById('saveButton');
    console.log('💾 Botón de guardar encontrado:', saveButton);
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveSettings);
        console.log('✅ Event listener de save button registrado');
    } else {
        console.error('❌ No se encontró el botón saveButton');
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Schedule toggle
    const scheduleToggle = document.getElementById('scheduleToggle');
    if (scheduleToggle) {
        scheduleToggle.addEventListener('click', toggleSchedule);
    }

    // Employees toggle
    const employeesToggle = document.getElementById('employeesToggle');
    if (employeesToggle) {
        employeesToggle.addEventListener('click', toggleEmployees);
    }

    // Add employee form
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', handleAddEmployee);
    }
}

// Load current data into form
function loadCurrentData() {
    if (!salonData) {
        console.warn('⚠️ No hay datos de peluquería para cargar');
        return;
    }

    console.log('📝 Cargando datos del perfil:', salonData);

    // Basic info
    const businessName = document.getElementById('businessName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const phone = document.getElementById('phone');
    const website = document.getElementById('website');
    const description = document.getElementById('description');

    if (businessName) {
        businessName.value = salonData.businessName || '';
        console.log('✅ Nombre cargado:', salonData.businessName);
    }
    if (address) {
        address.value = salonData.address || '';
        console.log('✅ Dirección cargada:', salonData.address);
    }
    if (city) {
        city.value = salonData.city || '';
        console.log('✅ Ciudad cargada:', salonData.city);
    }
    if (phone) {
        phone.value = salonData.phone || '';
        console.log('✅ Teléfono cargado:', salonData.phone);
    }
    if (website) {
        website.value = salonData.website || '';
        console.log('✅ Sitio web cargado:', salonData.website);
    }
    if (description) {
        description.value = salonData.description || '';
        console.log('✅ Descripción cargada:', salonData.description);
    }

    // Services
    loadServicesData();

    // Schedule
    loadScheduleData();

    // Employees
    loadEmployeesData();
}

// Load services data
function loadServicesData() {
    if (!salonData.services) {
        console.warn('⚠️ No hay servicios configurados');
        return;
    }

    console.log('🔧 Cargando servicios:', salonData.services);

    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
    console.log('📋 Checkboxes de servicios encontrados:', serviceCheckboxes.length);

    serviceCheckboxes.forEach(checkbox => {
        if (salonData.services.includes(checkbox.value)) {
            checkbox.checked = true;
            console.log('✅ Servicio marcado:', checkbox.value);
        }
    });
}

// Load schedule data
function loadScheduleData() {
    if (!salonData.schedule) return;

    // Buscar el contenedor específico de horarios
    const scheduleContainer = document.getElementById('scheduleGrid');
    if (!scheduleContainer) {
        console.warn('⚠️ No se encontró el contenedor de horarios');
        return;
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    scheduleContainer.innerHTML = '';

    days.forEach((day, index) => {
        const dayData = salonData.schedule[day];
        const dayName = dayNames[index];
        
        const dayRow = createScheduleRow(day, dayName, dayData);
        scheduleContainer.appendChild(dayRow);
    });

    // Actualizar el resumen de horarios
    updateScheduleSummary();
}

// Load employees data
function loadEmployeesData() {
    console.log('👥 Cargando datos de empleados:', salonData.employees);
    
    // Render employees list
    renderEmployeesList();
    
    // Update employees summary
    updateEmployeesSummary();
    
    // Update save button state
    updateSaveButtonState();
}

// Create schedule row
function createScheduleRow(day, dayName, dayData) {
    const div = document.createElement('div');
    div.className = 'day-schedule-row bg-gray-700 border-2 border-gray-600 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300';
    div.setAttribute('data-day', day);

    const isClosed = dayData && dayData.closed;
    const isEnabled = dayData && !dayData.closed;

    div.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center">
                <input type="checkbox" id="${day}-enabled" class="day-checkbox mr-3 w-5 h-5 text-blue-400 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" data-day="${day}" ${isEnabled ? 'checked' : ''}>
                <label for="${day}-enabled" class="text-sm font-semibold text-gray-100 cursor-pointer flex items-center">
                    <i class="fas fa-calendar-day mr-2 text-blue-400"></i>
                    ${dayName}
                </label>
            </div>
            <div class="schedule-times ${isEnabled ? '' : 'hidden'}">
                <div class="bg-blue-900 rounded-xl p-3 space-y-3">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-medium text-gray-300 whitespace-nowrap">De</span>
                            <input type="time" id="${day}-start" class="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-gray-100 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" value="${dayData && dayData.open ? dayData.open : '09:00'}">
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-medium text-gray-300 whitespace-nowrap">Hasta</span>
                            <input type="time" id="${day}-end" class="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-gray-100 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" value="${dayData && dayData.close ? dayData.close : '19:00'}">
                        </div>
                        <label class="flex items-center justify-center bg-gray-600 rounded px-2 py-1 cursor-pointer hover:bg-gray-500 transition-colors text-xs">
                            <input type="checkbox" id="${day}-break" class="mr-1 text-blue-400" ${dayData && dayData.break ? 'checked' : ''}>
                            <span class="font-medium text-gray-300 whitespace-nowrap">Con descanso</span>
                        </label>
                    </div>
                    <div class="break-times ${dayData && dayData.break ? '' : 'hidden'}">
                        <div class="bg-gray-700 rounded-lg p-3 border border-blue-600">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                                <div class="flex items-center space-x-2">
                                    <span class="text-xs text-blue-300 whitespace-nowrap">Descanso de</span>
                                    <input type="time" id="${day}-break-start" class="flex-1 px-2 py-1 border border-gray-600 bg-gray-700 text-gray-100 rounded text-xs focus:border-blue-500" value="${dayData && dayData.breakStart ? dayData.breakStart : '13:00'}">
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span class="text-xs text-blue-300 whitespace-nowrap">hasta</span>
                                    <input type="time" id="${day}-break-end" class="flex-1 px-2 py-1 border border-gray-600 bg-gray-700 text-gray-100 rounded text-xs focus:border-blue-500" value="${dayData && dayData.breakEnd ? dayData.breakEnd : '14:00'}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return div;
}

// Initialize schedule controls
function initializeScheduleControls() {
    // Schedule controls will be initialized after DOM is loaded
    setTimeout(() => {
        setupScheduleEventListeners();
    }, 100);
}

// Setup schedule event listeners
function setupScheduleEventListeners() {
    // Day checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('day-checkbox')) {
            const day = e.target.dataset.day;
            const scheduleTimes = e.target.closest('.day-schedule-row').querySelector('.schedule-times');
            
            if (e.target.checked) {
                scheduleTimes.classList.remove('hidden');
            } else {
                scheduleTimes.classList.add('hidden');
            }
        }

        // Break checkboxes
        if (e.target.id && e.target.id.includes('-break') && !e.target.id.includes('-break-start') && !e.target.id.includes('-break-end')) {
            const day = e.target.id.split('-')[0];
            const breakTimes = e.target.closest('.bg-blue-900').querySelector('.break-times');
            
            if (e.target.checked) {
                breakTimes.classList.remove('hidden');
            } else {
                breakTimes.classList.add('hidden');
            }
        }
    });
}

// Handle save settings
async function handleSaveSettings(e) {
    console.log('🎯 handleSaveSettings llamada!');
    if (e) e.preventDefault(); // Prevent default only if event exists
    console.log('💾 Iniciando guardado de configuración...');

    const formData = collectFormData();
    console.log('📋 Datos del formulario:', formData);
    
    if (!validateFormData(formData)) {
        console.log('❌ Validación fallida');
        return;
    }
    console.log('✅ Validación exitosa');

    try {
        showLoading('Guardando cambios...');
        
        // Prepare update data
        const updateData = {
            businessName: formData.businessName,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            description: formData.description || '',
            services: formData.services,
            schedule: formData.schedule,
            website: formData.website || '',
            employees: salonData.employees || [], // Include employees data
            lastUpdated: new Date()
        };

        // Update salon profile
        console.log('👤 Current user:', currentUser);
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }
        console.log('🆔 User UID:', currentUser.uid);
        console.log('📤 Enviando datos a Firebase:', updateData);
        await window.FirebaseAPI.updateSalonProfile(currentUser.uid, updateData);
        
        console.log('✅ Settings updated successfully');
        
        // Show success and update local data
        const hasEmployees = salonData.employees && salonData.employees.length > 0;
        const successMessage = hasEmployees 
            ? `Configuración guardada correctamente. ${salonData.employees.length} empleado${salonData.employees.length > 1 ? 's' : ''} registrado${salonData.employees.length > 1 ? 's' : ''}.`
            : 'Configuración guardada correctamente';
        
        showSuccess(successMessage);
        salonData = { ...salonData, ...updateData };
        
        // Update salon info in navigation
        updateSalonInfo();
        
        // Update save button state after saving
        updateSaveButtonState();

    } catch (error) {
        console.error('❌ Error saving settings:', error);
        showError('Error al guardar la configuración. Inténtalo de nuevo.');
    } finally {
        hideLoading();
    }
}

// Collect form data
function collectFormData() {
    console.log('📝 Recolectando datos del formulario...');
    
    const businessName = document.getElementById('businessName')?.value?.trim() || '';
    const address = document.getElementById('address')?.value?.trim() || '';
    const city = document.getElementById('city')?.value || '';
    const phone = document.getElementById('phone')?.value?.trim() || '';
    const description = document.getElementById('description')?.value?.trim() || '';
    const website = document.getElementById('website')?.value?.trim() || '';
    const services = collectServicesData();
    const schedule = collectScheduleData();
    
    const formData = {
        businessName,
        address,
        city,
        phone,
        description,
        website,
        services,
        schedule
    };
    
    console.log('📋 Datos recolectados:', formData);
    return formData;
}

// Collect services data
function collectServicesData() {
    const selectedServices = [];
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    
    serviceCheckboxes.forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });
    
    return selectedServices;
}

// Collect schedule data
function collectScheduleData() {
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const checkbox = document.getElementById(`${day}-enabled`);
        if (checkbox && checkbox.checked) {
            const startTime = document.getElementById(`${day}-start`).value;
            const endTime = document.getElementById(`${day}-end`).value;
            const breakCheckbox = document.getElementById(`${day}-break`);
            
            schedule[day] = {
                open: startTime,
                close: endTime
            };
            
            if (breakCheckbox && breakCheckbox.checked) {
                const breakStart = document.getElementById(`${day}-break-start`).value;
                const breakEnd = document.getElementById(`${day}-break-end`).value;
                
                schedule[day].break = true;
                schedule[day].breakStart = breakStart;
                schedule[day].breakEnd = breakEnd;
            }
        } else {
            schedule[day] = { closed: true };
        }
    });
    
    return schedule;
}

// Validate form data
function validateFormData(formData) {
    if (!formData.businessName) {
        showError('El nombre de la peluquería es obligatorio');
        return false;
    }
    
    if (!formData.address) {
        showError('La dirección es obligatoria');
        return false;
    }
    
    if (!formData.city) {
        showError('La ciudad es obligatoria');
        return false;
    }
    
    if (!formData.phone) {
        showError('El teléfono es obligatorio');
        return false;
    }
    
    if (!isValidPhone(formData.phone)) {
        showError('El formato del teléfono no es válido');
        return false;
    }
    
    if (formData.website && !isValidURL(formData.website)) {
        showError('El formato de la URL del sitio web no es válido');
        return false;
    }
    
    // Los servicios son opcionales, no requerimos al menos uno
    // if (formData.services.length === 0) {
    //     showError('Debes seleccionar al menos un servicio');
    //     return false;
    // }
    
    return true;
}

// Quick schedule functions
function setQuickSchedule(type) {
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    switch (type) {
        case 'standard':
            days.forEach((day, index) => {
                if (index < 5) { // Monday to Friday
                    schedule[day] = { open: "09:00", close: "19:00" };
                } else {
                    schedule[day] = { closed: true };
                }
            });
            break;
            
        case 'extended':
            days.forEach((day, index) => {
                if (index < 5) { // Monday to Friday
                    schedule[day] = { open: "08:00", close: "20:00" };
                } else {
                    schedule[day] = { closed: true };
                }
            });
            break;
            
        case 'weekend':
            days.forEach((day, index) => {
                if (index < 5) { // Monday to Friday
                    schedule[day] = { open: "09:00", close: "19:00" };
                } else if (index === 5) { // Saturday
                    schedule[day] = { open: "10:00", close: "18:00" };
                } else { // Sunday
                    schedule[day] = { closed: true };
                }
            });
            break;
    }
    
    // Actualizar datos locales y recargar
    salonData.schedule = schedule;
    loadScheduleData();
    showSuccess('Horario configurado correctamente');
}

function clearAllSchedule() {
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        schedule[day] = { closed: true };
    });
    
    // Actualizar datos locales y recargar
    salonData.schedule = schedule;
    loadScheduleData();
    showSuccess('Horario limpiado correctamente');
}

// Toggle schedule section
function toggleSchedule() {
    const scheduleContent = document.getElementById('scheduleContent');
    const scheduleIcon = document.getElementById('scheduleIcon');
    
    if (scheduleContent.classList.contains('hidden')) {
        // Abrir
        scheduleContent.classList.remove('hidden');
        scheduleIcon.classList.add('rotate-180');
        console.log('📅 Sección de horarios abierta');
    } else {
        // Cerrar
        scheduleContent.classList.add('hidden');
        scheduleIcon.classList.remove('rotate-180');
        console.log('📅 Sección de horarios cerrada');
    }
}

// Update schedule summary
function updateScheduleSummary() {
    if (!salonData || !salonData.schedule) return;

    const summaryElement = document.getElementById('scheduleSummary');
    if (!summaryElement) return;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    let openDays = 0;
    let summary = '';

    days.forEach((day, index) => {
        const dayData = salonData.schedule[day];
        if (dayData && !dayData.closed) {
            openDays++;
            if (summary === '') {
                summary = `${dayNames[index]} ${dayData.open}-${dayData.close}`;
            }
        }
    });

    if (openDays === 0) {
        summaryElement.textContent = 'Cerrado todos los días';
    } else if (openDays === 7) {
        summaryElement.textContent = 'Abierto todos los días';
    } else if (openDays === 5) {
        summaryElement.textContent = 'Lun-Vie';
    } else {
        summaryElement.textContent = `${openDays} días abierto`;
    }
}

// Toggle employees section
function toggleEmployees() {
    const employeesContent = document.getElementById('employeesContent');
    const employeesIcon = document.getElementById('employeesIcon');
    
    if (employeesContent.classList.contains('hidden')) {
        // Abrir
        employeesContent.classList.remove('hidden');
        employeesIcon.classList.add('rotate-180');
        console.log('👥 Sección de empleados abierta');
        
        // Inicializar horarios de empleados si no están inicializados
        if (!window.employeeScheduleInitialized) {
            initializeEmployeeSchedule();
            window.employeeScheduleInitialized = true;
        }
    } else {
        // Cerrar
        employeesContent.classList.add('hidden');
        employeesIcon.classList.remove('rotate-180');
        console.log('👥 Sección de empleados cerrada');
    }
}

// Initialize employee schedule
function initializeEmployeeSchedule() {
    const scheduleContainer = document.getElementById('employeeScheduleGrid');
    if (!scheduleContainer) return;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    scheduleContainer.innerHTML = '';

    days.forEach((day, index) => {
        const dayName = dayNames[index];
        const dayRow = createEmployeeScheduleRow(day, dayName);
        scheduleContainer.appendChild(dayRow);
    });
}

// Create employee schedule row
function createEmployeeScheduleRow(day, dayName) {
    const row = document.createElement('div');
    row.className = 'bg-gray-700 rounded-lg p-4 border border-gray-600';
    
    row.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <label class="flex items-center">
                <input type="checkbox" name="employee_${day}_open" class="mr-2 text-green-400 rounded focus:ring-green-500">
                <span class="text-sm font-medium text-gray-300">${dayName}</span>
            </label>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label class="block text-xs text-gray-400 mb-1">Apertura</label>
                <input type="time" name="employee_${day}_open_time" class="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-green-400">
            </div>
            <div>
                <label class="block text-xs text-gray-400 mb-1">Cierre</label>
                <input type="time" name="employee_${day}_close_time" class="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-green-400">
            </div>
        </div>
    `;

    return row;
}

// Handle add employee
async function handleAddEmployee(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const employeeData = {
        name: formData.get('employeeName').trim(),
        specialty: formData.get('employeeSpecialty').trim(),
        schedule: collectEmployeeScheduleData(),
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString()
    };

    // Validation
    if (!employeeData.name) {
        showError('El nombre del empleado es obligatorio');
        return;
    }

    // Add to local data
    if (!salonData.employees) {
        salonData.employees = [];
    }
    salonData.employees.push(employeeData);

    // Update UI immediately
    console.log('🔄 Actualizando UI...');
    renderEmployeesList();
    updateEmployeesSummary();
    updateSaveButtonState();
    clearEmployeeForm();
    
    showSuccess('Empleado agregado a la lista. Recuerda guardar los cambios.');
    console.log('✅ Empleado agregado a la lista:', employeeData);
}

// Collect employee schedule data
function collectEmployeeScheduleData() {
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const checkbox = document.querySelector(`input[name="employee_${day}_open"]`);
        const openTimeInput = document.querySelector(`input[name="employee_${day}_open_time"]`);
        const closeTimeInput = document.querySelector(`input[name="employee_${day}_close_time"]`);
        
        if (checkbox && checkbox.checked && openTimeInput && closeTimeInput) {
            const openTime = openTimeInput.value;
            const closeTime = closeTimeInput.value;
            
            if (openTime && closeTime) {
                schedule[day] = { open: openTime, close: closeTime };
            } else {
                schedule[day] = { closed: true };
            }
        } else {
            schedule[day] = { closed: true };
        }
    });
    
    return schedule;
}

// Save employees to Firebase
async function saveEmployeesToFirebase() {
    if (!window.firebaseAuth.currentUser) {
        throw new Error('Usuario no autenticado');
    }

    const userId = window.firebaseAuth.currentUser.uid;
    const salonRef = window.firebaseDb.collection('salons').doc(userId);
    
    await salonRef.update({
        employees: salonData.employees
    });
}

// Render employees list
function renderEmployeesList() {
    console.log('🎨 Renderizando lista de empleados...');
    const employeesList = document.getElementById('employeesList');
    const noEmployeesMessage = document.getElementById('noEmployeesMessage');
    
    if (!employeesList || !noEmployeesMessage) {
        console.warn('⚠️ No se encontraron elementos del DOM para empleados');
        return;
    }

    if (!salonData.employees || salonData.employees.length === 0) {
        console.log('📋 No hay empleados para mostrar');
        employeesList.innerHTML = '';
        noEmployeesMessage.classList.remove('hidden');
        return;
    }

    console.log(`📋 Mostrando ${salonData.employees.length} empleado(s)`);
    noEmployeesMessage.classList.add('hidden');
    employeesList.innerHTML = '';

    salonData.employees.forEach(employee => {
        const employeeCard = createEmployeeCard(employee);
        employeesList.appendChild(employeeCard);
    });
}

// Create employee card
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-green-400 transition-colors';
    
    const scheduleSummary = getEmployeeScheduleSummary(employee.schedule);
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
                <h4 class="text-lg font-semibold text-white mb-1">${employee.name}</h4>
                ${employee.specialty ? `<p class="text-sm text-gray-400 mb-2">${employee.specialty}</p>` : ''}
            </div>
            <button 
                onclick="deleteEmployee('${employee.id}')"
                class="text-red-400 hover:text-red-300 transition-colors ml-2"
                title="Eliminar empleado"
            >
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="bg-gray-600 rounded p-3">
            <div class="flex items-center text-sm text-gray-300">
                <i class="fas fa-clock mr-2 text-green-400"></i>
                <span>${scheduleSummary}</span>
            </div>
        </div>
    `;

    return card;
}

// Get employee schedule summary
function getEmployeeScheduleSummary(schedule) {
    if (!schedule) return 'Sin horario definido';

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    let openDays = 0;
    let summary = '';

    days.forEach((day, index) => {
        const dayData = schedule[day];
        if (dayData && !dayData.closed) {
            openDays++;
            if (summary === '') {
                summary = `${dayNames[index]} ${dayData.open}-${dayData.close}`;
            }
        }
    });

    if (openDays === 0) {
        return 'No trabaja';
    } else if (openDays === 7) {
        return 'Todos los días';
    } else if (openDays === 5) {
        return 'Lun-Vie';
    } else {
        return `${openDays} días`;
    }
}

// Update employees summary
function updateEmployeesSummary() {
    const summaryElement = document.getElementById('employeesSummary');
    if (!summaryElement) return;

    if (!salonData.employees || salonData.employees.length === 0) {
        summaryElement.textContent = 'Gestionar empleados';
    } else if (salonData.employees.length === 1) {
        summaryElement.textContent = '1 empleado';
    } else {
        summaryElement.textContent = `${salonData.employees.length} empleados`;
    }
}

// Delete employee
async function deleteEmployee(employeeId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
        return;
    }

    // Remove from local data
    salonData.employees = salonData.employees.filter(emp => emp.id !== employeeId);

    // Update UI immediately
    renderEmployeesList();
    updateEmployeesSummary();
    updateSaveButtonState();
    
    showSuccess('Empleado eliminado de la lista. Recuerda guardar los cambios.');
    console.log('🗑️ Empleado eliminado de la lista:', employeeId);
}

// Clear employee form
function clearEmployeeForm() {
    const form = document.getElementById('addEmployeeForm');
    if (form) {
        form.reset();
    }
    
    // Clear schedule checkboxes
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const checkbox = document.querySelector(`input[name="employee_${day}_open"]`);
        if (checkbox) checkbox.checked = false;
    });
}

// Update save button state
function updateSaveButtonState() {
    console.log('🔘 Actualizando estado del botón de guardar...');
    const saveButton = document.getElementById('saveButton');
    const saveButtonText = document.getElementById('saveButtonText');
    const saveButtonBadge = document.getElementById('saveButtonBadge');
    
    if (!saveButton || !saveButtonText || !saveButtonBadge) {
        console.warn('⚠️ No se encontraron elementos del botón de guardar');
        return;
    }

    const hasEmployees = salonData.employees && salonData.employees.length > 0;
    
    if (hasEmployees) {
        saveButtonText.textContent = `Guardar Cambios (${salonData.employees.length} empleado${salonData.employees.length > 1 ? 's' : ''})`;
        saveButtonBadge.classList.remove('hidden');
        saveButton.classList.add('from-green-600', 'to-green-700');
        saveButton.classList.remove('from-blue-600', 'to-blue-700');
    } else {
        saveButtonText.textContent = 'Guardar Cambios';
        saveButtonBadge.classList.add('hidden');
        saveButton.classList.remove('from-green-600', 'to-green-700');
        saveButton.classList.add('from-blue-600', 'to-blue-700');
    }
}

// Handle logout
async function handleLogout() {
    try {
        await window.firebaseAuth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        showError('Error al cerrar sesión');
    }
}

// Utility functions
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showLoading(message = 'Cargando...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    
    if (messageEl) messageEl.textContent = message;
    if (overlay) overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `px-6 py-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    let bgColor, icon, textColor;
    
    switch (type) {
        case 'success':
            bgColor = 'bg-green-600';
            icon = 'fas fa-check';
            textColor = 'text-white';
            break;
        case 'error':
            bgColor = 'bg-red-600';
            icon = 'fas fa-exclamation-triangle';
            textColor = 'text-white';
            break;
        default:
            bgColor = 'bg-blue-600';
            icon = 'fas fa-info-circle';
            textColor = 'text-white';
    }
    
    notification.className += ` ${bgColor} ${textColor}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Make functions available globally
window.initializeSettingsPage = initializeSettingsPage;
window.initializeSettings = initializeSettings;
window.handleSaveSettings = handleSaveSettings; 