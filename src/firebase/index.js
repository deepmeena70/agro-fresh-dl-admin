import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAH8YFVcIpV159rAINNWtLlmtZPs9PYReQ",
    authDomain: "agrofresh-dl.firebaseapp.com",
    projectId: "agrofresh-dl",
    storageBucket: "agrofresh-dl.appspot.com",
    messagingSenderId: "186433974952",
    appId: "1:186433974952:web:83e8ffb34b35e8b07dc89d",
    measurementId: "G-DMBQKLC465"
  };

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;