// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbgH2MggQ1L6idBVo7z6sL5yvOz0iqvSQ",
  authDomain: "zambane-4e4bf.firebaseapp.com",
  projectId: "zambane-4e4bf",
  storageBucket: "zambane-4e4bf.appspot.com",
  messagingSenderId: "427321972901",
  appId: "1:427321972901:web:f4b7118d2a950e085ed54c",
  measurementId: "G-JJMNB715LH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Function to show messages
function showMessage(message, divId) {
  const div = document.getElementById(divId);
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = message;
  messageDiv.style.display = 'block';
  messageDiv.style.opacity = 1;
  div.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.style.opacity = 0;
    div.removeChild(messageDiv); // Clean up after the message fades out
  }, 5000);
}

// Sign-up event listener
const signUp = document.getElementById('signUp');
signUp.addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();
  const db = getFirestore();

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data in Firestore
    const userData = {
      name: name,
      email: email,
      password: password, // Consider NOT saving the password in plain text for security
    };
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, userData);

    // Show success message and redirect
    showMessage('Account created successfully', 'signUpMessage');
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Error writing document", error);

    // Handle errors
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      showMessage('Email already in use', 'signUpMessage');
    } else if (errorCode === 'auth/weak-password') {
      showMessage('Password is too weak', 'signUpMessage');
    } else {
      showMessage('Unable to create user. Please try again.', 'signUpMessage');
    }
  }
});
