import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWZIh0he1a1x-2J-S8XSoKPx91M8snKTw",
    authDomain: "zhu-pos-saas.firebaseapp.com",
    projectId: "zhu-pos-saas",
    storageBucket: "zhu-pos-saas.firebasestorage.app",
    messagingSenderId: "896907465981",
    appId: "1:896907465981:web:94d31675d4148ca1f9da94",
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
