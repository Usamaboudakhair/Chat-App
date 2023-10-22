// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { sendPasswordResetEmail } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXyGrHsnhTUXUTFMu6Ec4k_CPlVK2KDHA",
  authDomain: "chat-fe33b.firebaseapp.com",
  projectId: "chat-fe33b",
  storageBucket: "chat-fe33b.appspot.com",
  messagingSenderId: "199427494790",
  appId: "1:199427494790:web:2afbfc4c65c80c8dc3d207"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(); 
export const db = getFirestore();
export const doPasswordReset = email => auth.sendPasswordResetEmail(email);