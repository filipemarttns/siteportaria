import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSLrxQH6k1XGWq93WYENzplqJ6DRTqEf8",
  authDomain: "controle-de-portaria-c2ba6.firebaseapp.com",
  projectId: "controle-de-portaria-c2ba6",
  storageBucket: "controle-de-portaria-c2ba6.firebasestorage.app",
  messagingSenderId: "656428327600",
  appId: "1:656428327600:web:ccf86031f62c46360d9175",
  measurementId: "G-05W3SNZFVV"
};

// Inicialize o Firebase
export const app = initializeApp(firebaseConfig);
