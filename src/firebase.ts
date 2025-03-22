
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAskjNRKaLPC36hkv5gMbMVU1t5_zlV_5U",
  authDomain: "knowcode-2-round-2.firebaseapp.com",
  projectId: "knowcode-2-round-2",
  storageBucket: "knowcode-2-round-2.firebasestorage.app",
  messagingSenderId: "485340885672",
  appId: "1:485340885672:web:169f63088c53d1a3fa489d"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
export { auth };

// Initialize Firestore
export const db = getFirestore(app);

