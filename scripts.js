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
    const signupBtn = document.querySelector('.btn-primary');
    const openSignUp = document.getElementById('openSignUp');
    const openSignIn = document.getElementById('openSignIn');
    const closeBtns = document.querySelectorAll('.close-btn');

    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'block';
        });
    }

    if (document.querySelector('.sign-out') && signinModal) {
        document.querySelector('.sign-out').addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            signinModal.style.display = 'block';
        });
    }

    if (openSignIn) {
        openSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            signinModal.style.display = 'block';
        });
    }

    if (openSignUp) {
        openSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            signinModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (signupModal) signupModal.style.display = 'none';
            if (signinModal) signinModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === signupModal) signupModal.style.display = 'none';
        if (e.target === signinModal) signinModal.style.display = 'none';
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
 // Button and authentication listener
const makeRequestBtn = document.getElementById("makeRequestBtn");

// Function to update button text based on login status
function updateButtonText() {
  const user = supabase.auth.user();
  if (user) {
    makeRequestBtn.textContent = makeRequestBtn.dataset.loggedInText;
  } else {
    makeRequestBtn.textContent = makeRequestBtn.dataset.defaultText;
  }
}

// Initial button text update
updateButtonText();

// Add an event listener for the button
makeRequestBtn.addEventListener("click", () => {
  const user = supabase.auth.user();
  if (user) {
    console.log("User is logged in. Proceed to make a request.");
    // Navigate or perform the action for making a request
  } else {
    console.log("User is not logged in. Please sign in first.");
    // Optionally open the sign-in modal
    document.getElementById("signinModal").style.display = "block";
  }
});

});
