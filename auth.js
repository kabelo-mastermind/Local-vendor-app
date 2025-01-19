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
      // Close all modals
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
    }
  });

   // Sign-out button handler
   const signoutBtn = document.getElementById('sign-out');
   signoutBtn.addEventListener('click', async () => {
     const { error } = await supabase.auth.signOut();
 
     if (error) {
       alert(error.message);
     } else {
       clearSessionData();
       alert('Signed out successfully!');
       window.location.href = 'https://zambane.netlify.app/';
     }
   });
 
   // Clear session data
   function clearSessionData() {
     currentUser = null;
     // Clear any other session-related data here
     console.log('Session data cleared');
   }
 

  // Authentication state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      currentUser = null;
    } else if (event === "SIGNED_IN") {
      console.log("User session login", session.user);
      currentUser = session.user;
    }
    updateButtons();
  });

  // Button references
  const getStartedBtn = document.getElementById("getStartedBtn");
  const makeRequestBtn = document.getElementById("makeRequestBtn");

  function updateButtons() {
    if (currentUser) {
      getStartedBtn.style.display = "none";
      makeRequestBtn.style.display = "inline-block";
    } else {
      getStartedBtn.style.display = "inline-block";
      makeRequestBtn.style.display = "none";
    }
  }

  // Fetch session on initial load
  (async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      console.log("User is logged in:", currentUser);
    } else {
      currentUser = null;
      console.log("User is not logged in.");
    }
    updateButtons();
  })();

  // Button event listeners
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
      document.getElementById("signinModal").style.display = "block";
    });
  }

  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", () => {
      console.log("Request made successfully");
      // Add any additional logic here for handling the request
    });
  }


// Forgot Password Form Handler
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("ForgotPasswordEmail").value.trim();
  const messageDiv = document.getElementById("ForgotPasswordMessage");

  if (!email) {
    messageDiv.style.display = "block";
    messageDiv.textContent = "Please enter your valid email address.";
    messageDiv.style.color = "red";
    return;
  }

  try {
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://zambane.netlify.app/", // Update this URL
    });
    

    if (error) {
      throw new Error(error.message);
    }

    // Success message
    messageDiv.style.display = "block";
    messageDiv.textContent = "Password reset email sent! Please check your inbox.";
    messageDiv.style.color = "green";

    // Clear form
    forgotPasswordForm.reset();
  } catch (err) {
    // Error message
    messageDiv.style.display = "block";
    messageDiv.textContent = `Error: ${err.message}`;
    messageDiv.style.color = "red";
  }
});

// Close modal on close button click for Forgot Password modal
document.querySelector("#ForgotPassword .close-btn").addEventListener("click", () => {
  document.getElementById("ForgotPassword").style.display = "none";
});

// Reset Password
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("access_token");

  if (accessToken) {
    // Valid token found, show the reset password modal
    const resetPasswordModal = document.querySelector(".reset-password-container");
    resetPasswordModal.style.display = "block";

    // Handle password reset logic here
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    resetPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const resetMessage = document.getElementById("resetMessage");

      if (newPassword !== confirmPassword) {
        resetMessage.innerText = "Passwords do not match.";
        resetMessage.style.color = "red";
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        resetMessage.innerText = error.message;
        resetMessage.style.color = "red";
      } else {
        resetMessage.innerText = "Password updated successfully!";
        resetMessage.style.color = "green";
        setTimeout(() => {
          resetPasswordModal.style.display = "none";
          window.location.href = "https://zambane.netlify.app/"; // Redirect to homepage after reset
        }, 2000);
      }
    });
  } else {
    // No access token in URL, maybe handle error or redirect to login page
    console.log("Access token is missing");
  }
});
}
