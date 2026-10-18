/**
 * firebaseconfig.js
 * 
 * Arquivo de configuração do Firebase para o Estúdio Tarja Preta.
 * Substitua os valores abaixo pelas credenciais fornecidas no Console do Firebase:
 * https://console.firebase.google.com/ -> Configurações do Projeto -> Seus Aplicativos
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

// =======================================================================
// COLE SUAS CREDENCIAIS DO FIREBASE AQUI:
// =======================================================================
export const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Verifica se as credenciais foram preenchidas pelo usuário
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" &&
    !firebaseConfig.apiKey.includes("SUA_")
  );
};

// Inicializa o app Firebase com segurança
/** @type {import('firebase/app').FirebaseApp | null} */
let app = null;

/** @type {import('firebase/auth').Auth | null} */
let auth = null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Aviso ao inicializar Firebase Auth:", error);
}

export { 
  app, 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
};
