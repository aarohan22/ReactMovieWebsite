
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-T2TKd3psTXPFZ-4b-k_188x1YsAXJfo",
  authDomain: "movieapp-4f054.firebaseapp.com",
  projectId: "movieapp-4f054",
  storageBucket: "movieapp-4f054.appspot.com", 
  messagingSenderId: "314117383377",
  appId: "1:314117383377:web:33536213bfcd3a6f99d1f0",
  measurementId: "G-FRLLW7HM4G"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
