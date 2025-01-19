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
      console.log("Request made");
      // Add any additional logic here for handling the request
    });
  }

  // change password
  // Change Password/Email Form Handler
const changePasswordForm = document.getElementById("changePasswordForm");
changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("ChangePasswordEmail").value.trim();
  const password = document.getElementById("ChangePasswordPassword").value.trim();
  const messageDiv = document.getElementById("ChangePasswordMessage");

  // Check if the user is logged in
  const { data: session, error: sessionError } = await supabase.auth.getSession();

  if (!session) {
    alert("You must be logged in to change email or password.");
    return;
  }

  // Determine what to change
  const isChangingEmail = email !== ""; // If email field is filled, update email
  const isChangingPassword = password !== ""; // If password field is filled, update password

  try {
    if (isChangingEmail) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email,
      });

      if (emailError) {
        throw new Error(emailError.message);
      }

      messageDiv.style.display = "block";
      messageDiv.textContent = "Email updated successfully!";
      messageDiv.style.color = "green";
    }

    if (isChangingPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordError) {
        throw new Error(passwordError.message);
      }

      messageDiv.style.display = "block";
      messageDiv.textContent = "Password updated successfully!";
      messageDiv.style.color = "green";
    }

    // Clear the form after successful update
    changePasswordForm.reset();

    // Optional: Close the modal
    document.getElementById("ChangePassword").style.display = "none";
  } catch (err) {
    messageDiv.style.display = "block";
    messageDiv.textContent = `Error: ${err.message}`;
    messageDiv.style.color = "red";
  }
});

}
