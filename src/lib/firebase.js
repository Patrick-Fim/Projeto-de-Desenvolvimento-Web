// Conexão única com o Firebase (Firestore).
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6cFvuc7h_5ogmQX1W0l24Il1fpHey9tg",
  authDomain: "protetores-da-terra.firebaseapp.com",
  projectId: "protetores-da-terra",
  storageBucket: "protetores-da-terra.firebasestorage.app",
  messagingSenderId: "240813241963",
  appId: "1:240813241963:web:bb3be37c436758dbb5a32e",
};

// Evita reinicializar o app no hot-reload do Next.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
