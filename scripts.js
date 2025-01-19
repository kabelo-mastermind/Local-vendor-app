// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Responsive Navbar
    const menuIcon = document.querySelector('.menu-icon span');
    const navLinks = document.querySelector('.nav-links');
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Initialize the map
    var map = L.map('map').setView([-25.5416, 28.0992], 13); // Centered in Soshanguve
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Coordinates for customers (blue markers)
    var customerCoordinates = [
        [-25.5400, 28.0950],
        [-25.5420, 28.0980],
        [-25.5435, 28.1010],
        [-25.5440, 28.0965],
        [-25.5410, 28.1000],
        [-25.5430, 28.0945],
        [-25.5425, 28.0905],
        [-25.5415, 28.0890]
    ];

    // Coordinates for vendors (green markers)
    var vendorCoordinates = [
        [-25.5390, 28.0920],
        [-25.5405, 28.0935],
    ];

    // Add markers for customers
    customerCoordinates.forEach(coord => {
        L.marker(coord, { 
            icon: L.icon({
                iconUrl: './assets/markers/customer.jpg',
                iconSize: [30, 38],
                iconAnchor: [15, 50],
                popupAnchor: [0, -50]
            }) 
        })
        .addTo(map)
        .bindPopup("<b>Customer</b>");
    });

    // Add markers for vendors
    vendorCoordinates.forEach(coord => {
        L.marker(coord, { 
            icon: L.icon({
                iconUrl: './assets/markers/vendor.jpg',
                iconSize: [30, 38],
                iconAnchor: [15, 50],
                popupAnchor: [0, -50]
            }) 
        })
        .addTo(map)
        .bindPopup("<b>Vendor</b>");
    });

    // Modal Handling
    const signupModal = document.getElementById('signupModal');
    const signinModal = document.getElementById('signinModal');
    const ForgotPasswordModal = document.getElementById('ForgotPassword');
    const signupBtn = document.querySelector('.btn-primary');
    const openSignUp = document.getElementById('openSignUp');
    const openSignIn = document.getElementById('openSignIn');
    const openForgotPassword = document.getElementById('openForgotPassword');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Function to show a modal
    function showModal(modal) {
        if (modal) modal.style.display = 'block';
    }

    // Function to hide a modal
    function hideModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    // Open Sign Up modal
    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', () => {
            showModal(signupModal);
        });
    }

    // Open Sign In modal
    if (openSignIn) {
        openSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(signupModal);
            showModal(signinModal);
        });
    }

    // Open Sign Up modal from Sign In
    if (openSignUp) {
        openSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(signinModal);
            showModal(signupModal);
        });
    }

    // Open Change Password modal
    if (openForgotPassword) {
        openForgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(signinModal); // Hide the Sign In modal if open
            showModal(ForgotPasswordModal); // Show the Change Password modal
        });
    }

    // Close all modals when close button is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(signupModal);
            hideModal(signinModal);
            hideModal(ForgotPasswordModal);
        });
    });

    // Close modals when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) hideModal(signupModal);
        if (e.target === signinModal) hideModal(signinModal);
        if (e.target === ForgotPasswordModal) hideModal(ForgotPasswordModal);
    });

    // Smooth scrolling to the map section
    const openMapBtn = document.getElementById('openMap');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('map').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // reset password
    document.addEventListener('DOMContentLoaded', () => {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const isResetPassword = urlParams.get('reset');
      
        // Show the Reset Password Modal if ?reset=true
        if (isResetPassword) {
          const resetModal = document.getElementById('resetPasswordForm');
          resetModal.style.display = 'block';
        }
      });
      
});
