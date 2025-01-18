// Check if Supabase client is initialized
if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;

  // Listen for sign-up form submission
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-up successful! Please check your email to confirm.");
    }
  });

  // Listen for sign-in form submission
  const signinForm = document.getElementById("signinForm");
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const { error } = await supabase.auth.signIn({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-in successful!");
      window.location.reload(); // Reload to update the button text
    }
  });

  // Handle sign-out
  const signoutBtn = document.getElementById("sign-out");
  signoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      alert("Signed out successfully!");
      window.location.reload(); // Reload to reset the button text
    }
  });

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session);
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      updateButtonText(); // Update the button text dynamically
    }
  });
}
