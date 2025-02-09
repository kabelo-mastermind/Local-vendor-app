


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

    // });
    const menuIcon = document.querySelector(".menu-icon");
    const navLinks = document.querySelector(".nav-links");
    
    menuIcon.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    

     const feedbackModal = document.getElementById("feedbackModal");
    const openFeedbackBtn = document.getElementById("openFeedback");
    const closeFeedbackBtn = document.querySelector("#feedbackModal .close-btn");
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackSuccessMessage = document.getElementById("feedbackSuccessMessage");

    // Open feedback modal
    openFeedbackBtn.addEventListener("click", (e) => {
        e.preventDefault();
        feedbackModal.style.display = "block";
    });

    // Close feedback modal
    closeFeedbackBtn.addEventListener("click", () => {
        feedbackModal.style.display = "none";
    });

    // Handle feedback submission
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const feedbackMessage = document.getElementById("feedbackMessage").value;
        
        if (feedbackMessage.trim() !== "") {
            feedbackSuccessMessage.style.display = "block";
            setTimeout(() => {
                feedbackModal.style.display = "none";
                feedbackSuccessMessage.style.display = "none";
                feedbackForm.reset();
            }, 2000);
        }
    });
    // Close modal if clicking outside of it
    window.addEventListener("click", (e) => {
        if (e.target === feedbackModal) {
            feedbackModal.style.display = "none";
        }
    });
});