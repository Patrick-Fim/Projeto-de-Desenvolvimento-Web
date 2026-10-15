// Conexão única com o Firebase (Firestore).
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJejQ_Ct66sntp7balwc4mPWCSAA8RfcM",
  authDomain: "protetores-da-terra-c5f97.firebaseapp.com",
  projectId: "protetores-da-terra-c5f97",
  storageBucket: "protetores-da-terra-c5f97.firebasestorage.app",
  messagingSenderId: "466233828461",
  appId: "1:466233828461:web:b3d5eb9aabbaee1484cb64",
};

// Evita reinicializar o app no hot-reload do Next.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
