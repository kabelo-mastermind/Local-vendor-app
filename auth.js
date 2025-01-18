// Access the Supabase client from the global window object
const supabase = window.supabase; // Do NOT redeclare it with `const` or `let`

// Sign-up form
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert('Sign-up successful! Please check your email to confirm your account.');
  }
});

// Sign-in form
const signinForm = document.getElementById('signinForm');
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  const { session, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert('Sign-in successful!');
    window.location.href = 'index.html';
  }
});

// Sign-out button
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
