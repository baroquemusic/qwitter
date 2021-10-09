import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAE0g86XTALvfo3NzOY7E3e8krDw1lCPSc",
  authDomain: "qwitter-182ec.firebaseapp.com",
  projectId: "qwitter-182ec",
  storageBucket: "qwitter-182ec.appspot.com",
  messagingSenderId: "339921917323",
  appId: "1:339921917323:web:27dce9cf691aa4995f8b8e"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore()

export default db
