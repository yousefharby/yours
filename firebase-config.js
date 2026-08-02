// ============================================
// YOURS – Firebase Config (Real Credentials)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjCyaEKRLK8EMWoaBmuNckfoimCUKLHZs",
  authDomain: "yours-ebc41.firebaseapp.com",
  projectId: "yours-ebc41",
  storageBucket: "yours-ebc41.firebasestorage.app",
  messagingSenderId: "1080966519444",
  appId: "1:1080966519444:web:2400dd61939ffeae8cb281",
  measurementId: "G-D1L8SSR4BP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp
};
