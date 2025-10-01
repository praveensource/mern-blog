// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d0aa3.firebaseapp.com",
  projectId: "mern-blog-d0aa3",
  storageBucket: "mern-blog-d0aa3.firebasestorage.app",
  messagingSenderId: "79835285489",
  appId: "1:79835285489:web:14013f1166193ca421a650"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);