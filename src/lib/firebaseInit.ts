import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyAEFLXY7lY9jahMvzvirm7AdVsuANGkkJY',
	authDomain: 'sparkle-077.firebaseapp.com',
	projectId: 'sparkle-077',
	storageBucket: 'sparkle-077.appspot.com',
	messagingSenderId: '129187052248',
	appId: '1:129187052248:web:737d9d2533931bc2e7b5ad',
	measurementId: 'G-YNHT19C0J2',
	databaseURL: 'https://sparkle-077-default-rtdb.firebaseio.com/'
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export default firebaseApp;
