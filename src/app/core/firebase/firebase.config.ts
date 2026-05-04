import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD4isJNY4plXGsEWG5OCNTbplTQHiZuC34",
  authDomain: "whitelabel-6fb71.firebaseapp.com",
  projectId: "whitelabel-6fb71",
  storageBucket: "whitelabel-6fb71.firebasestorage.app",
  messagingSenderId: "96149507052",
  appId: "1:96149507052:web:375bf572df918609928ec9",
  measurementId: "G-1YFPSPK804"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);