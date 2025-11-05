// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg-wQlFazBk7qwN-1_TzMe2SeWyKtInI4",
  authDomain: "blogapp-2cfcc.firebaseapp.com",
  projectId: "blogapp-2cfcc",
  storageBucket: "blogapp-2cfcc.firebasestorage.app",
  messagingSenderId: "179254964477",
  appId: "1:179254964477:web:32c93876fd2603cd960e94",
  measurementId: "G-K5N4G1NH22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);