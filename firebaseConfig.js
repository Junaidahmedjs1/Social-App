import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyBTgxBI9_w-1Mh7qj8yGc5be9NWL8hmKPY",
    authDomain: "social-app-786.firebaseapp.com",
    projectId: "social-app-786",
    storageBucket: "social-app-786.firebasestorage.app",
    messagingSenderId: "505494714639",
    appId: "1:505494714639:web:b6b7ce50c51a029b3d267a"
  };
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);