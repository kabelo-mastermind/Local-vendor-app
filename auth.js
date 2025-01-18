// auth.js

// Check if the supabase client is initialized
if (!window.supabase) {
    console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
    alert("Supabase client initialization failed.");
  } else {
    // Access the Supabase client from the global `window` object
    const supabase = window.supabase;
  // auth.js
if (!window.supabase) {
    console.error("Supabase client is not initialized.");
    alert("Supabase client initialization failed.");
  } else {
    const supabase = window.supabase;
  
    // Now this should work
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
    });
  }
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
  
    // Listen to authentication state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
      }
    });
  }
  