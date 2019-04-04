import firebase from 'firebase/index';
import 'firebase/empty-import';
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyDWqlfA_9gDLekdXazu8RfLXwuQzCwu6d8",
    authDomain: "react-spa-6e279.firebaseapp.com",
    databaseURL: "https://react-spa-6e279.firebaseio.com",
    projectId: "react-spa-6e279",
    storageBucket: "react-spa-6e279.appspot.com",
    messagingSenderId: "904559241890"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;