import { supabase } from './supabase.js';

const signupForm = document.getElementById('signupModal');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { user, error } = await supabase.auth.signUp({ email, password, name });

  if (error) {
    alert(error.message);
  } else {
    alert('Sign-up successful! Please check your email to confirm your account.');
  }
});
// sign in
const signinForm = document.getElementById('signinModal');
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { session, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert('Sign-in successful!');
    window.location.href = 'index.html';
  }
});
// sign out
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