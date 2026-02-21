import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATwlZjZPQCMbunPjG6dM2P3L0H5JVajqA",
  authDomain: "itetude-ce41d.firebaseapp.com",
  projectId: "itetude-ce41d",
  storageBucket: "itetude-ce41d.firebasestorage.app",
  messagingSenderId: "690766932831",
  appId: "1:690766932831:web:258086381298771e9924ea"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
