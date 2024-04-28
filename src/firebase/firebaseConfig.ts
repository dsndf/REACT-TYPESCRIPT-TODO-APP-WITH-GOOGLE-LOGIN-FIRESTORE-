import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getEnv } from "../lib/getEnv";
const firebaseConfig = {
  apiKey: getEnv("API_KEY"),
  authDomain: getEnv("AUTH_DOMAIN"),
  projectId: getEnv("PROJECT_ID"),
  storageBucket: getEnv("STORAGE"),
  messagingSenderId: getEnv("SENDER_ID"),
  appId: getEnv("APP_ID"),
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth(app);
export const signInWithGooglePopup = async () => {
  return signInWithPopup(auth, provider);
};

export const db = getFirestore(app);
