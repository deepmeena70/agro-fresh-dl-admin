import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsbVcOkvH6UuZOxf9PwEKf_MG5V3GViQ4",
  authDomain: "agrofreshdl-23f35.firebaseapp.com",
  projectId: "agrofreshdl-23f35",
  storageBucket: "agrofreshdl-23f35.appspot.com",
  messagingSenderId: "1036768144779",
  appId: "1:1036768144779:web:245679f638c067dd5e938e",
  measurementId: "G-2QTFZGFK15"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;