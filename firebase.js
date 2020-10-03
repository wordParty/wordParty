// firebase.js
import firebase from 'firebase/app';
import 'firebase/database';

// Initialize Firebase
const config = {
	apiKey: 'AIzaSyCS6fkr1nkfcWbuxowQcwS55dUFGm9qa8g',
	authDomain: 'wordparty-92c9f.firebaseapp.com',
	databaseURL: 'https://wordparty-92c9f.firebaseio.com',
	projectId: 'wordparty-92c9f',
	storageBucket: 'wordparty-92c9f.appspot.com',
	messagingSenderId: '410418051346',
	appId: '1:410418051346:web:10cd4fb319baf427c8dbcb',
};
firebase.initializeApp(config);

// this exports the CONFIGURED version of firebase
export default firebase;