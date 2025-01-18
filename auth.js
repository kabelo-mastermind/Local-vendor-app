// Check if the Supabase client is initialized
if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  // Access the Supabase client from the global `window` object
  const supabase = window.supabase;
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
        data: {
          name: name,
        },
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

    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Sign-in successful!');
      window.location.href = 'index.html'; // Redirect after successful sign-in
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
      window.location.href = 'index.html'; // Redirect after sign-out
    }
  });

  let currentUser = null;

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      currentUser = session.user; // Store the user
    } else {
      currentUser = null;
    }
    updateButtonText(); // Update button text when the auth state changes
  });
  // Button and authentication listener
  const makeRequestBtn = document.getElementById("makeRequestBtn");

  // Add an event listener for the button
  makeRequestBtn.addEventListener("click", async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user) {
      console.log("User is logged in. Proceed to make a request.");
      // Navigate or perform the action for making a request
    } else {
      console.log("User is not logged in. Please sign in first.");
      // Optionally open the sign-in modal
      document.getElementById("signinModal").style.display = "block";
    }
  });
  

  function updateButtonText() {
    if (currentUser) {
      makeRequestBtn.textContent = makeRequestBtn.dataset.loggedInText;
    } else {
      makeRequestBtn.textContent = makeRequestBtn.dataset.defaultText;
    }
  }
}
