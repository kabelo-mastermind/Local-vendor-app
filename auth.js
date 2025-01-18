// Use the Supabase client from the global window object
const supabase = window.supabase;

// Sign-up form
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    alert(error.message);
  } else {
    alert('Sign-up successful! Please check your email to confirm your account.');
  }
});

// Other event listeners remain the same
