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
    currentUser = session?.user || null;
    console.log("user3333333333", currentUser);
    
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
}
