import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCigN-4ZceJK7JEOtjKu8CwgzKOYE4kAiU",
  authDomain: "fb-crud-6b6b3.firebaseapp.com",
  projectId: "fb-crud-6b6b3",
  storageBucket: "fb-crud-6b6b3.appspot.com",
  messagingSenderId: "734464234164",
  appId: "1:734464234164:web:3ce7f795bc32dcecbafde1"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db =getDatabase(app);
export {db,storage};