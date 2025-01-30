import {signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

const provider = new GoogleAuthProvider();

const form = document.querySelector("#form")
const email = document.querySelector("#email")
const password = document.querySelector("#password")


form.addEventListener("submit", event => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      window.location=`home.html`
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
      
    });
})

const googleBtn = document.querySelector("#googleBtn");

googleBtn.addEventListener("click", () => {
    console.log('google called');


    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(user);
    window.location=`home.html`
    
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    
  });
})