if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;

  // Sign-up form handler
  const signupForm = document.getElementById('signupModal');
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
      alert('Sign-up successful! Please check your email to confirm your account.');
    }
  });

  // Sign-in form handler
  const signinForm = document.getElementById('signinModal');
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    

    if (error) {
      alert(error.message);
    } else {
      alert('Sign-in successful!');
      window.location.href = 'index.html';
    }
  });

  // Sign-out button handler
  const signoutBtn = document.getElementById('sign-out');
  signoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      alert('Signed out successfully!');
      window.location.href = 'index.html';
    }
  });

  // Authentication state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      currentUser = null;
    } else if (event === 'SIGNED_IN') {
      console.log("user session login", session.user);
      
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
  }
  

  // Fetch session on initial load
  (async () => {
    const { data: session } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    updateButtonText();
  })();

  // Make request button event listener
  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", () => {
      if (currentUser) {
        console.log("User is logged in. Proceed to make a request.");
      } else {
        console.log("User is not logged in. Please sign in first.");
        document.getElementById("signinModal").style.display = "block";
      }
    });
  }
}
