if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;

  // Sign-up form handler
  const signupForm = document.getElementById("signupModal");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-up successful! Please check your email to confirm your account.");
    }
  });

  // Sign-in form handler
  const signinForm = document.getElementById("signinModal");
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-in successful!");
      // window.location.href = "index.html";
        // Close all modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    }
  });

  // Sign-out button handler
  const signoutBtn = document.getElementById("sign-out");
  signoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      alert("Signed out successfully!");
      window.location.href = "index.html";
    }
  });

  // Authentication state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      currentUser = null;
    } else if (event === "SIGNED_IN") {
      console.log("User session login", session.user);
      currentUser = session.user;
    }
    updateButtonText();
  });

  // Button reference and text update
  const makeRequestBtn = document.getElementById("makeRequestBtn");
  function updateButtonText() {
    if (currentUser) {
      makeRequestBtn.textContent = makeRequestBtn.dataset.loggedInText;
    } else {
      makeRequestBtn.textContent = makeRequestBtn.dataset.defaultText;
    }

    // Force DOM repaint to apply the text change immediately
    makeRequestBtn.style.display = "none";
    makeRequestBtn.offsetHeight; // Trigger reflow
    makeRequestBtn.style.display = "inline-block";
  }

  // Fetch session on initial load
  (async () => {
    const { data: session } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    updateButtonText();
  })();

  // Make request button event listener
  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default action to stop unwanted behavior.

      if (currentUser) {
        // Change behavior when logged in
        if (makeRequestBtn.textContent === makeRequestBtn.dataset.loggedInText) {
          console.log("requested");
          makeRequestBtn.disabled = true; // Optional: Prevent further clicks.
        }
      } else {
        // Open signin modal when user is not logged in
        const signinModal = document.getElementById("signinModal");
        if (signinModal) {
          signinModal.style.display = "block"; // Open only the signin modal
        } else {
          console.error("Signin modal not found!");
        }
      }
    });
  }
}
