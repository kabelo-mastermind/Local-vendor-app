// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbgH2MggQ1L6idBVo7z6sL5yvOz0iqvSQ",
  authDomain: "zambane-4e4bf.firebaseapp.com",
  projectId: "zambane-4e4bf",
  storageBucket: "zambane-4e4bf.firebasestorage.app",
  messagingSenderId: "427321972901",
  appId: "1:427321972901:web:f4b7118d2a950e085ed54c",
  measurementId: "G-JJMNB715LH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);