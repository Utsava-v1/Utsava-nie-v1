import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
