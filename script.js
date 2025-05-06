// auth.js - User Authentication System

// Initialize the authentication system
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for navigation between pages
    const goToRegister = document.getElementById('go-to-register');
    if (goToRegister) {
        goToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('registration-page');
        });
    }

    const goToLogin = document.getElementById('go-to-login');
    if (goToLogin) {
        goToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('login-page');
        });
    }

    // Set up form submission handlers
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Initialize appointment system
    initializeAppointmentSystem();

    // Check if user is already logged in
    checkAuthStatus();
});

// Function to show different pages
function showPage(pageId) {
    // Hide all pages
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('registration-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'none';
    
    // Show the selected page
    document.getElementById(pageId).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to handle user registration
function handleRegistration(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Check if user already exists
    const users = getUsers();
    if (users.some(user => user.email === email)) {
        showMessage('Email is already registered', 'error');
        return;
    }
    
    // Create new user object (store hashed password in a real application)
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password, // In production, ALWAYS hash passwords
        registeredOn: new Date().toISOString(),
        appointments: [] // Add appointments array for this user
    };
    
    // Add user to storage
    users.push(newUser);
    saveUsers(users);
    
    // Show success message
    showMessage('Registration successful! You can now log in.', 'success');
    
    // Reset form and redirect to login
    document.getElementById('registration-form').reset();
    showPage('login-page');
}

// Function to handle user login
function handleLogin(e) {
    if (e) e.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validate form
    if (!email || !password) {
        showMessage('Please enter both email and password', 'error');
        return;
    }
    
    // Check credentials
    const users = getUsers();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        showMessage('Invalid email or password', 'error');
        return;
    }
    
    // Set authentication status
    setAuthenticatedUser(user);
    
    // Show success message
    showMessage('Login successful! Redirecting to dashboard...', 'success');
    
    // Reset form
    document.getElementById('login-form').reset();
    
    // Redirect to dashboard
    setTimeout(() => {
        showPage('dashboard-page');
        initializeDashboard();
    }, 1500);
}

// Function to display messages to the user
function showMessage(message, type) {
    // Get the current visible container
    const visibleContainer = document.querySelector('div[style="display: block;"] .auth-container') || 
                             document.querySelector('.auth-container');
    
    if (!visibleContainer) {
        console.error('No container found to display message');
        alert(message); // Fallback to alert if no container is found
        return;
    }
    
    // Check if message container exists, create if not
    let messageContainer = visibleContainer.querySelector('.message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        visibleContainer.prepend(messageContainer);
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to container
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
    
    // Auto-dismiss after a delay
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Function to get users from storage
function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

// Function to save users to storage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Generate a unique user ID
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Set the authenticated user
function setAuthenticatedUser(user) {
    // Create a safe user object without sensitive info
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAuthenticated: true
    };
    
    // Store in session
    sessionStorage.setItem('currentUser', JSON.stringify(safeUser));
    
    // Also set as current active user for appointments
    localStorage.setItem('activeUserId', user.id);
}

// Check if user is authenticated
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.isAuthenticated) {
        // User is logged in, show dashboard
        showPage('dashboard-page');
        initializeDashboard();
    } else {
        // Show login page or home page if it exists
        const homePage = document.getElementById('home-page');
        if (homePage) {
            showPage('home-page');
        } else {
            showPage('login-page');
        }
    }
}

// Get the current user
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Initialize the dashboard with user data and appointments
function initializeDashboard() {
    const currentUser = getCurrentUser();
    
    // Set welcome message
    const welcomeElement = document.querySelector('#dashboard-page .user-welcome h2');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${currentUser.name}!`;
    }
    
    // Set up logout button if it exists
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Load user's appointments
    loadUserAppointments();
}

// Function to log out user
function logout() {
    // Clear session
    sessionStorage.removeItem('currentUser');
    
    // Show success message in the login page
    setTimeout(() => {
        showMessage('You have been logged out successfully.', 'success');
    }, 100);
    
    // Redirect to home or login
    showPage('home-page');
}

// Add some basic CSS for messages
const style = document.createElement('style');
style.textContent = `
    .message-container {
        margin-bottom: 20px;
    }
    
    .message {
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    
    .message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .dashboard-container {
        max-width: 600px;
        margin: 40px auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .user-info {
        margin: 20px 0;
        padding: 15px;
        background-color: #fff;
        border-radius: 4px;
        border-left: 4px solid #007bff;
    }
    
    .status-confirmed {
        color: #155724;
        background-color: #d4edda;
        border-radius: 4px;
        padding: 2px 6px;
    }
    
    .status-pending {
        color: #856404;
        background-color: #fff3cd;
        border-radius: 4px;
        padding: 2px 6px;
    }
    
    .status-cancelled {
        color: #721c24;
        background-color: #f8d7da;
        border-radius: 4px;
        padding: 2px 6px;
    }
`;
document.head.appendChild(style);

// Appointment system integration
// ------------------------------------

// Initialize the appointment system
function initializeAppointmentSystem() {
    // Set up event listeners for departments and doctors
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', populateDoctors);
    }
    
    const requestAppointmentBtn = document.getElementById('request-appointment');
    if (requestAppointmentBtn) {
        requestAppointmentBtn.addEventListener('click', showConfirmationModal);
    }
    
    const cancelAppointmentBtn = document.getElementById('cancel-appointment');
    if (cancelAppointmentBtn) {
        cancelAppointmentBtn.addEventListener('click', closeModal);
    }
    
    const confirmAppointmentBtn = document.getElementById('confirm-appointment');
    if (confirmAppointmentBtn) {
        confirmAppointmentBtn.addEventListener('click', addAppointment);
    }
    
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    const clearAppointmentsBtn = document.getElementById('clear-appointments');
    if (clearAppointmentsBtn) {
        clearAppointmentsBtn.addEventListener('click', clearAllAppointments);
    }
    
    // Set minimum date to today for appointment date input
    const appointmentDateInput = document.getElementById('appointment-date');
    if (appointmentDateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        appointmentDateInput.min = formattedDate;
    }
}

// Doctor database
const doctors = {
    cardiology: [
        { id: 1, name: "Dr. Paris Ramadwa" },
        { id: 2, name: "Dr. Tlotlo Molefe" }
    ],
    neurology: [
        { id: 3, name: "Dr. Milicent Mogane" },
        { id: 4, name: "Dr. Karabo Mbeki" }
    ],
    orthopedics: [
        { id: 5, name: "Dr. Letlhogonolo Kwazi" },
        { id: 6, name: "Dr. Reitumetse Mosehla" }
    ],
    pediatrics: [
        { id: 7, name: "Dr. Nkateko Mkhabela" },
        { id: 8, name: "Dr. Azola Jokweni" }
    ],
    dermatology: [
        { id: 9, name: "Dr. Precious Moloi" },
        { id: 10, name: "Dr. David Makhura" }
    ]
};

// Function to populate doctors dropdown based on selected department
function populateDoctors() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    
    if (!departmentSelect || !doctorSelect) return;
    
    const department = departmentSelect.value;
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    
    if (department && doctors[department]) {
        doctors[department].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
}

// Function to show confirmation modal for appointment booking
function showConfirmationModal() {
    // Form validation
    if (!validateForm()) {
        return;
    }

    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeInput = document.getElementById('appointment-time');
    const appointmentNotesInput = document.getElementById('appointment-notes');
    const confirmationModal = document.getElementById('confirmation-modal');
    const appointmentDetailsList = document.getElementById('appointment-details');
    
    const department = departmentSelect.options[departmentSelect.selectedIndex].text;
    const doctorId = doctorSelect.value;
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
    const date = new Date(appointmentDateInput.value);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const time = formatTime(appointmentTimeInput.value);
    const notes = appointmentNotesInput.value;

    // Populate confirmation modal
    appointmentDetailsList.innerHTML = `
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    `;

    // Show modal
    confirmationModal.style.display = 'flex';
}

// Close the confirmation modal
function closeModal() {
    const confirmationModal = document.getElementById('confirmation-modal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
    }
}

// Add a new appointment for the current user
function addAppointment() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeInput = document.getElementById('appointment-time');
    const appointmentNotesInput = document.getElementById('appointment-notes');
    const bookingForm = document.getElementById('booking-form');
    
    const department = departmentSelect.options[departmentSelect.selectedIndex].text;
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
    const date = new Date(appointmentDateInput.value);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const time = formatTime(appointmentTimeInput.value);
    const notes = appointmentNotesInput.value;

    // Get current user
    const userId = localStorage.getItem('activeUserId');
    if (!userId) {
        showMessage('You must be logged in to book appointments.', 'error');
        closeModal();
        return;
    }

    // Create new appointment object
    const newAppointment = {
        id: Date.now().toString(),
        doctor: doctorName,
        department: department,
        date: formattedDate,
        time: time,
        notes: notes,
        status: "confirmed" // Set initial status as confirmed
    };

    // Add appointment to user record
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        showMessage('User not found. Please log in again.', 'error');
        closeModal();
        return;
    }
    
    // Initialize appointments array if it doesn't exist
    if (!users[userIndex].appointments) {
        users[userIndex].appointments = [];
    }
    
    // Add appointment and save
    users[userIndex].appointments.push(newAppointment);
    saveUsers(users);

    // Update UI
    updateAppointmentsList();

    // Close modal and reset form
    closeModal();
    if (bookingForm) bookingForm.reset();
    
    // Reset doctor select
    if (doctorSelect) {
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    }
    
    // Show success message
    showMessage('Appointment booked successfully!', 'success');
}

// Load and display the current user's appointments
function loadUserAppointments() {
    const userId = localStorage.getItem('activeUserId');
    if (!userId) return;
    
    const users = getUsers();
    const user = users.find(user => user.id === userId);
    
    if (!user || !user.appointments) {
        // No appointments found
        const appointmentsList = document.getElementById('appointments-list');
        if (appointmentsList) {
            appointmentsList.innerHTML = '<p>No appointments scheduled.</p>';
        }
        return;
    }
    
    // Update UI with user's appointments
    updateAppointmentsList(user.appointments);
}

// Update the appointments list in the UI
function updateAppointmentsList(appointmentsData) {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointmentsList) return;
    
    // If no appointments data provided, load from current user
    if (!appointmentsData) {
        const userId = localStorage.getItem('activeUserId');
        if (!userId) {
            appointmentsList.innerHTML = '<p>No appointments scheduled.</p>';
            return;
        }
        
        const users = getUsers();
        const user = users.find(user => user.id === userId);
        
        if (!user || !user.appointments || user.appointments.length === 0) {
            appointmentsList.innerHTML = '<p>No appointments scheduled.</p>';
            return;
        }
        
        appointmentsData = user.appointments;
    }
    
    appointmentsList.innerHTML = '';
    
    if (appointmentsData.length === 0) {
        appointmentsList.innerHTML = '<p>No appointments scheduled.</p>';
        return;
    }

    // Sort appointments by date/time
    appointmentsData.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
    });

    // Create list items for each appointment
    appointmentsData.forEach(appointment => {
        const listItem = document.createElement('li');
        listItem.className = 'ticket-item';
        listItem.innerHTML = `
            <div>
                <strong>${appointment.doctor}</strong> - ${appointment.department}
                <p>${appointment.date} at ${appointment.time}</p>
                ${appointment.notes ? `<p><em>Notes: ${appointment.notes}</em></p>` : ''}
            </div>
            <span class="ticket-status status-${appointment.status}">${capitalize(appointment.status)}</span>
        `;
        appointmentsList.appendChild(listItem);
    });
}

// Form validation for appointment booking
function validateForm() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeInput = document.getElementById('appointment-time');
    
    if (!departmentSelect || !doctorSelect || !appointmentDateInput || !appointmentTimeInput) {
        return false;
    }

    const department = departmentSelect.value;
    const doctor = doctorSelect.value;
    const date = appointmentDateInput.value;
    const time = appointmentTimeInput.value;

    if (!department || !doctor || !date || !time) {
        showMessage('Please fill all required fields.', 'error');
        return false;
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage('Please select a future date.', 'error');
        return false;
    }

    return true;
}

// Format time from 24h to 12h format
function formatTime(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':');
    let period = 'AM';
    let hour = parseInt(hours);
    
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    }
    
    if (hour === 0) {
        hour = 12;
    }
    
    return `${hour}:${minutes} ${period}`;
}

// Capitalize first letter of a string
function capitalize(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Clear all appointments for the current user
function clearAllAppointments() {
    const userId = localStorage.getItem('activeUserId');
    if (!userId) {
        showMessage('You must be logged in to manage appointments.', 'error');
        return;
    }
    
    // Get user's appointments
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        showMessage('User not found. Please log in again.', 'error');
        return;
    }
    
    // Check if user has appointments
    if (!users[userIndex].appointments || users[userIndex].appointments.length === 0) {
        showMessage('You have no appointments to clear.', 'info');
        return;
    }
    
    // Confirm deletion
    if (confirm('Are you sure you want to clear all your appointments? This action cannot be undone.')) {
        // Clear appointments and save
        users[userIndex].appointments = [];
        saveUsers(users);
        
        // Update UI
        updateAppointmentsList();
        
        // Show success message
        showMessage('All appointments have been cleared successfully.', 'success');
    }
}
