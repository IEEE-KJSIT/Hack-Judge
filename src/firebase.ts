
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBETLH6CXLiOLGptIm-REk3EAh73p_VNJM",
  authDomain: "algoforge-1817d.firebaseapp.com",
  projectId: "algoforge-1817d",
  storageBucket: "algoforge-1817d.firebasestorage.app",
  messagingSenderId: "705860952578",
  appId: "1:705860952578:web:705c21dc0f0ffd69c1fd1b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
export { auth };

// Initialize Firestore
export const db = getFirestore(app);

