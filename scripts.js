if (!window.supabase) {
    console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
    alert("Supabase client initialization failed.");
} else {
    const supabase = window.supabase;


    // Wait for the DOM to load
    document.addEventListener('DOMContentLoaded', () => {
        

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
