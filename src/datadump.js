import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBETLH6CXLiOLGptIm-REk3EAh73p_VNJM",
    authDomain: "algoforge-1817d.firebaseapp.com",
    projectId: "algoforge-1817d",
    storageBucket: "algoforge-1817d.firebasestorage.app",
    messagingSenderId: "705860952578",
    appId: "1:705860952578:web:705c21dc0f0ffd69c1fd1b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const teamNames = [
  "Team Voldemort",
  "Code Blooded",
  "lorem ipsum",
  "Unfortuanely Fortunate",
  "npx Masters",
  "Falcons",
  "Syntax Error",
  "TechShastra",
  "</ByteZeta>",
  "Dev Ally",
  "V4",
  "Anon",
  "MADS 404",
  "Mappa",
  "Debug Thugs",
  "MangoDB",
  "Star",
  "KnowWiz",
  "Fantastic Four",
  "ROSHNI",
  "AlgoZenith",
  "Unpaid Labours",
  "Four Loop",
  "Team PASH"
];

// Loop through team names and add each to Firestore with null for other fields
teamNames.forEach(async (teamName) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      teamName: teamName,
      title: null,
      description: null,
      demoUrl: null,
      repoUrl: null,
      members: null,
      createdAt: serverTimestamp(), // Timestamp for the creation
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});
