import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUFKtck5zFw4jy0hmogflgtZaj68_TaOM",
    authDomain: "urologiaudes.firebaseapp.com",
    projectId: "urologiaudes",
    storageBucket: "urologiaudes.firebasestorage.app",
    messagingSenderId: "593233184412",
    appId: "1:593233184412:web:cbefe676a60d68b23fcf59",
    measurementId: "G-42LW1EJNG4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
