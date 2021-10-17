import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBblyaeA4OieOfwQxImza-bmuLvVOa_jmI",
  authDomain: "agro-fresh-dl.firebaseapp.com",
  projectId: "agro-fresh-dl",
  storageBucket: "agro-fresh-dl.appspot.com",
  messagingSenderId: "614318304032",
  appId: "1:614318304032:web:059c6578abf52fb8138545",
  measurementId: "G-YBHJW50DBB"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;