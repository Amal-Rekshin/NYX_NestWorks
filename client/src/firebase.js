import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace this with your actual Firebase configuration object
// You can get this from your Firebase Console > Project Settings > General > Your apps (Web)
const firebaseConfig = {
  apiKey: "AIzaSyD4FSVPTG8KCdYtS8Q-81qBf5v6-9Gq21g",
  authDomain: "time-table-18a48.firebaseapp.com",
  projectId: "time-table-18a48",
  storageBucket: "time-table-18a48.firebasestorage.app",
  messagingSenderId: "796607151880",
  appId: "1:796607151880:web:52369e8e63e838f082f6bd",
  measurementId: "G-HR0NT6C5FE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use device language for auth (SMS language)
auth.useDeviceLanguage();

export { app, auth };
