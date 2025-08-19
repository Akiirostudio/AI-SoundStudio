import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoyM2-CpUUSXzNAYUICutB3YrVXe48u6Q",
  authDomain: "vibe-sona.firebaseapp.com",
  projectId: "vibe-sona",
  storageBucket: "vibe-sona.firebasestorage.app",
  messagingSenderId: "136987715238",
  appId: "1:136987715238:web:af3b1b6917e9ebc2d13667",
  measurementId: "G-BTCSMYLYR6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
