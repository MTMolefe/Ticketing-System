 <script>
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
    </script>