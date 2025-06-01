// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWnac5v_Lm0zu6APlopmguuWQMNBItCYE",
  authDomain: "utsav-ems.firebaseapp.com",
  projectId: "utsav-ems",
  storageBucket: "utsav-ems.firebasestorage.app",
  messagingSenderId: "771712968160",
  appId: "1:771712968160:web:e26e929112924369623785",
  measurementId: "G-KN1QD8XTD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };