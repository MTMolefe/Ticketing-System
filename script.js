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


        // Appointments array to store booked appointments
        let appointments = [
            {
                id: 1,
                doctor: "Dr. Paris Ramadwa",
                department: "Cardiology",
                date: "May 5, 2025",
                time: "10:30 AM",
                notes: "Follow-up after cardiac stress test",
                status: "confirmed"
            },
            {
                id: 2,
                doctor: "Dr. Milicent Mogane",
                department: "Neurology",
                date: "May 12, 2025",
                time: "2:15 PM",
                notes: "Recurring headaches investigation",
                status: "pending"
            }
        ];

        // Elements
        const departmentSelect = document.getElementById('department');
        const doctorSelect = document.getElementById('doctor');
        const appointmentDateInput = document.getElementById('appointment-date');
        const appointmentTimeInput = document.getElementById('appointment-time');
        const appointmentNotesInput = document.getElementById('appointment-notes');
        const requestAppointmentBtn = document.getElementById('request-appointment');
        const confirmationModal = document.getElementById('confirmation-modal');
        const appointmentDetailsList = document.getElementById('appointment-details');
        const cancelAppointmentBtn = document.getElementById('cancel-appointment');
        const confirmAppointmentBtn = document.getElementById('confirm-appointment');
        const closeModalBtn = document.querySelector('.close-modal');
        const appointmentsList = document.getElementById('appointments-list');

        // Set minimum date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        appointmentDateInput.min = formattedDate;

        // Event Listeners
        departmentSelect.addEventListener('change', populateDoctors);
        requestAppointmentBtn.addEventListener('click', showConfirmationModal);
        cancelAppointmentBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        confirmAppointmentBtn.addEventListener('click', addAppointment);

        // Functions
        function populateDoctors() {
            const department = departmentSelect.value;
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
            
            if (department) {
                doctors[department].forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    doctorSelect.appendChild(option);
                });
            }
        }

        function showConfirmationModal() {
            // Form validation
            if (!validateForm()) {
                return;
            }

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

        function closeModal() {
            confirmationModal.style.display = 'none';
        }

        function addAppointment() {
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

            // Create new appointment object
            const newAppointment = {
                id: appointments.length + 1,
                doctor: doctorName,
                department: department,
                date: formattedDate,
                time: time,
                notes: notes,
                status: "confirmed" // Set initial status as confirmed
            };

            // Add to appointments array
            appointments.push(newAppointment);

            // Update UI
            updateAppointmentsList();

            // Close modal and reset form
            closeModal();
            document.getElementById('booking-form').reset();
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        }

        function updateAppointmentsList() {
            appointmentsList.innerHTML = '';
            
            if (appointments.length === 0) {
                appointmentsList.innerHTML = '<p>No appointments scheduled.</p>';
                return;
            }

            appointments.sort((a, b) => {
                const dateA = new Date(a.date + ' ' + a.time);
                const dateB = new Date(b.date + ' ' + b.time);
                return dateA - dateB;
            });

            appointments.forEach(appointment => {
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

        function validateForm() {
            const department = departmentSelect.value;
            const doctor = doctorSelect.value;
            const date = appointmentDateInput.value;
            const time = appointmentTimeInput.value;

            if (!department || !doctor || !date || !time) {
                alert('Please fill all required fields.');
                return false;
            }

            // Check if date is in the past
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Please select a future date.');
                return false;
            }

            return true;
        }

        function formatTime(time24h) {
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

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function logout() {
            alert('Logging out...');
            // In a real application, this would redirect to the login page
            // window.location.href = 'login.html';
        }

        // Initialize page
        updateAppointmentsList();
        // Logout function
        function logout() {
            // In a real app, you would clear session/storage
            showPage('home-page');
        }
