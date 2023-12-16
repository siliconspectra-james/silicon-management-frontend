import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBdv7pXR1-C5G_Rk9XACk33lMii0fuCf9Y",
  authDomain: "silicon-spectra-management.firebaseapp.com",
  projectId: "silicon-spectra-management",
  storageBucket: "silicon-spectra-management.appspot.com",
  messagingSenderId: "410487252922",
  appId: "1:410487252922:web:9e55cc33305b5d12369f83",
  measurementId: "G-T8BDFYJ9R1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
// export const firestore = getFirestore(app); // Initialize Firestore