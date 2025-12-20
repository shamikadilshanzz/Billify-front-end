import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/*const firebaseConfig = {
  apiKey: "AIzaSyDi_YxuzWMCzKCu63X6L3FPay-thB7mdz8",
  authDomain: "billify-7b276.firebaseapp.com",
  projectId: "billify-7b276",
  storageBucket: "billify-7b276.firebasestorage.app",
  messagingSenderId: "1053658518616",
  appId: "1:1053658518616:web:d3a0ae9fbc3767bf75e62d",
  measurementId: "G-4ESLSN69BD",
};*/
const firebaseConfig = {
  apiKey: "AIzaSyDza4byn--Xe5568X8yGdxy04zxC4DMS74",
  authDomain: "billify-69f32.firebaseapp.com",
  projectId: "billify-69f32",
  storageBucket: "billify-69f32.firebasestorage.app",
  messagingSenderId: "270272190520",
  appId: "1:270272190520:web:3f84f073e5be80e2372ecd"
};


const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);;
