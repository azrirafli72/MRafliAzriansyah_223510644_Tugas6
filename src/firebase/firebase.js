// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBDJkiTAipTcNywUDNke9vjJo9VjfloeSY",
  authDomain: "mrafliazri-tugas6.firebaseapp.com",
  projectId: "mrafliazri-tugas6",
  storageBucket: "mrafliazri-tugas6.appspot.com",
  messagingSenderId: "493389166930",
  appId: "1:493389166930:web:edbb5702eadd95ad38e28b",
  measurementId: "G-75FNKRBB53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };
