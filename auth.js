// Access the Supabase client from the global window object
let supabase;
if (window.supabase) {
  supabase = window.supabase;
} else {
  const SUPABASE_URL = "https://lrdrzttoghslrwoprasi.supabase.co"; // Replace with your actual Supabase URL
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZHJ6dHRvZ2hzbHJ3b3ByYXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNTk3MjAsImV4cCI6MjA1MjYzNTcyMH0.zGGMI8amEFNHWyvOdOjWiB3fMWWVhkt2-hcLl37XPTc"
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  window.supabase = supabase; // Attach to the global window object
}

// Sign-up form
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

// Sign-in form
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

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in');
  }
});
