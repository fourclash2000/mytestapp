import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA40FWkrm-dhXB2pbg_07F_YRJ1xAjw2Y",
  authDomain: "mytestapp-49296.firebaseapp.com",
  projectId: "mytestapp-49296",
  storageBucket: "mytestapp-49296.appspot.com",
  messagingSenderId: "47536901402",
  appId: "1:47536901402:web:d40c641cd83d67915f30a3",
  measurementId: "G-K3D2F52VZ7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 