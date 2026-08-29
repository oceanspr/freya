import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7I19ksKFubrUfcCCe9m0T8a_1f_1VZ40",
  authDomain: "newsletter-2e2f7.firebaseapp.com",
  projectId: "newsletter-2e2f7",
  storageBucket: "newsletter-2e2f7.firebasestorage.app",
  messagingSenderId: "1055078678490",
  appId: "1:1055078678490:web:048291700fa2b5e44f8ae3",
  measurementId: "G-ER7GH5KYLZ"
};

const auth = getAuth();
const provider = new GoogleAuthProvider();

const login = async () => {
  const result = await signInWithPopup(auth, provider);
  console.log("Logged in as:", result.user.displayName);
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
