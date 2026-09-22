import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNwwWmLmVtKQM5bH9XTEtQHGWXZRvl6Rc",
    authDomain: "store-otp-20db0.firebaseapp.com",
    projectId: "store-otp-20db0",
    storageBucket: "store-otp-20db0.firebasestorage.app",
    messagingSenderId: "861846971477",
    appId: "1:861846971477:web:72bebf6564b00fa81da0dc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);