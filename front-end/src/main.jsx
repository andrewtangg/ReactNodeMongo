import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl0hhSAL-FIqHD7qRSKJTp-iCIt5DY3mw",
  authDomain: "full-stack-react-eed33.firebaseapp.com",
  projectId: "full-stack-react-eed33",
  storageBucket: "full-stack-react-eed33.firebasestorage.app",
  messagingSenderId: "1071995787142",
  appId: "1:1071995787142:web:eef67a320653a76132be07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    
  </StrictMode>,
)
