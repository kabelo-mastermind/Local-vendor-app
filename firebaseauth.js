// Import the functions you need from the SDKs
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
const auth = getAuth();
const db = getFirestore();

// Function to show messages
function showMessage(message, divId, type = "success") {
  const div = document.getElementById(divId);
  div.innerHTML = `<span class="${type}">${message}</span>`;
  div.style.display = "block";

  // Hide the message after 5 seconds
  setTimeout(() => {
    div.style.display = "none";
    div.innerHTML = "";
  }, 5000);
}

// Sign-up form submission
const signUpForm = document.getElementById("signUp");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission
  console.log("Form submitted");

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  console.log(name, email, password); // Log values to check if they are correct

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Save user data in Firestore
    const userData = {
      name: name,
      email: email,
    };
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, userData);
    console.log("User data saved to Firestore");

    showMessage("Account created successfully", "signUpMessage", "success");

    // Redirect to home page
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    console.error("Error creating user:", error); // Log the entire error object
    const errorCode = error.code;
    console.log("Error code:", errorCode); // Log the error code

    if (errorCode === "auth/email-already-in-use") {
      console.log("Email already in use");
      showMessage("Email already in use", "signUpMessage", "error");
    } else if (errorCode === "auth/weak-password") {
      console.log("Password is too weak");
      showMessage("Password is too weak", "signUpMessage", "error");
    } else {
      console.log("Unable to create user. Please try again.");
      showMessage("Unable to create user. Please try again.", "signUpMessage", "error");
    }
}
  }
});
