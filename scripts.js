if (!window.supabase) {
    console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
    alert("Supabase client initialization failed.");
} else {
    const supabase = window.supabase;
    let currentUser = null;
    let userLocation = null;

    // Wait for the DOM to load
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize the map
        var map = L.map('map').setView([-25.5416, 28.0992], 13); // Centered in Soshanguve
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Fetch customer coordinates from Supabase
        async function fetchMarkers() {
            // Fetch customer data
            const { data: customers, error: customerError } = await supabase
                .from('customers') // Replace with your actual table name
                .select('latitude, longitude'); // Assuming these are the columns for coordinates

            if (customerError) {
                console.error("Error fetching customers:", customerError);
                alert("Failed to fetch customer data. Please try again later.");
                return;
            }

            // Add customer markers
            customers.forEach(customer => {
                L.marker([customer.latitude, customer.longitude], { 
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
        }

        // Call the function to fetch markers from Supabase
        fetchMarkers();

        // Modal Handling
        const signupModal = document.getElementById('signupModal');
        const signinModal = document.getElementById('signinModal');
        const signupBtn = document.querySelector('.btn-primary');
        const openSignUp = document.getElementById('openSignUp');
        const openSignIn = document.getElementById('openSignIn');
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

        // Close all modals when close button is clicked
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                hideModal(signupModal);
                hideModal(signinModal);
            });
        });

        // Close modals when clicking outside the modal content
        window.addEventListener('click', (e) => {
            if (e.target === signupModal) hideModal(signupModal);
            if (e.target === signinModal) hideModal(signinModal);
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

    });
}
