 
        // Function to show different pages
        function showPage(pageId) {
            // Hide all pages
            document.getElementById('home-page').style.display = 'none';
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('signup-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'none';
            
            // Show the selected page
            document.getElementById(pageId).style.display = 'block';
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
        
        // Handle login
        function handleLogin() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }
            // auth.js - User Authentication System

            // Initialize the authentication system
            document.addEventListener('DOMContentLoaded', function () {
                // Set up event listeners for navigation between pages
                document.getElementById('go-to-register').addEventListener('click', function (e) {
                    e.preventDefault();
                    showPage('registration-page');
                });

                document.getElementById('go-to-login').addEventListener('click', function (e) {
                    e.preventDefault();
                    showPage('login-page');
                });

                // Set up form submission handlers
                document.getElementById('registration-form').addEventListener('submit', handleRegistration);
                document.getElementById('login-form').addEventListener('submit', handleLogin);

                // Check if user is already logged in
                checkAuthStatus();
            });

            // Function to switch between pages
            function showPage(pageId) {
                // Hide all pages
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('registration-page').style.display = 'none';

                // Show the requested page
                document.getElementById(pageId).style.display = 'block';
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
                    registeredOn: new Date().toISOString()
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
                e.preventDefault();

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

                // Redirect to dashboard (or home page)
                setTimeout(() => {
                    redirectToDashboard();
                }, 1500);
            }

            // Function to display messages to the user
            function showMessage(message, type) {
                // Check if message container exists, create if not
                let messageContainer = document.querySelector('.message-container');
                if (!messageContainer) {
                    messageContainer = document.createElement('div');
                    messageContainer.className = 'message-container';
                    document.querySelector('.auth-container').prepend(messageContainer);
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
                    messageElement.remove();
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
            }

            // Check if user is authenticated
            function checkAuthStatus() {
                const currentUser = getCurrentUser();
                if (currentUser && currentUser.isAuthenticated) {
                    // User is logged in, redirect to dashboard
                    redirectToDashboard();
                } else {
                    // Show login page
                    showPage('login-page');
                }
            }

            // Get the current user
            function getCurrentUser() {
                const userJson = sessionStorage.getItem('currentUser');
                return userJson ? JSON.parse(userJson) : null;
            }

            // Function to redirect to dashboard
            function redirectToDashboard() {
                // Create dashboard page if it doesn't exist
                let dashboardPage = document.getElementById('dashboard-page');
                if (!dashboardPage) {
                    dashboardPage = createDashboardPage();
                }

                // Hide other pages and show dashboard
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('registration-page').style.display = 'none';
                dashboardPage.style.display = 'block';
            }

            // Create dashboard page
            function createDashboardPage() {
                const currentUser = getCurrentUser();

                // Create dashboard container
                const dashboardPage = document.createElement('div');
                dashboardPage.id = 'dashboard-page';

                // Set content
                dashboardPage.innerHTML = `
        <div class="container">
            <div class="dashboard-container">
                <h2>Welcome, ${currentUser.name}!</h2>
                <div class="user-info">
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                </div>
                <button id="logout-button" class="btn btn-danger">Logout</button>
            </div>
        </div>
    `;

                // Add to body
                document.body.appendChild(dashboardPage);

                // Add logout functionality
                dashboardPage.querySelector('#logout-button').addEventListener('click', function () {
                    // Clear session
                    sessionStorage.removeItem('currentUser');

                    // Redirect to login
                    dashboardPage.style.display = 'none';
                    showPage('login-page');
                });

                return dashboardPage;
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
`;
            document.head.appendChild(style);
            
            // In a real app, you would send this to a server
            // For demo purposes, just redirect to dashboard
            showPage('dashboard-page');
        }
        
        // Handle signup
        function handleSignup() {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            // In a real app, you would send this to a server
            // For demo purposes, just redirect to dashboard
            showPage('dashboard-page');
        }
        
        // Logout function
        function logout() {
            // In a real app, you would clear session/storage
            showPage('home-page');
        }
   
