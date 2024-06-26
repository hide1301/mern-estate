// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'mern-estate-5fa18.firebaseapp.com',
    projectId: 'mern-estate-5fa18',
    storageBucket: 'mern-estate-5fa18.appspot.com',
    messagingSenderId: '707767514769',
    appId: '1:707767514769:web:5d388585aa128edc96b130',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
