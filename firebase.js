// Firebase initialization. Replace firebaseConfig with your project values from Firebase console.
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, query, orderByKey, limitToLast } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAY92MjxcEYDVkyLLjfrKZtaNxjjQPMfsU",
  authDomain: "volcano-monitoring-system.firebaseapp.com",
  databaseURL: "https://volcano-monitoring-system-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "volcano-monitoring-system",
  storageBucket: "volcano-monitoring-system.firebasestorage.app",
  messagingSenderId: "794005088472",
  appId: "1:794005088472:web:0520b77dda8e2228788fad"
};

// Avoid re-initializing in development.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getDatabase(app);

const readingsRef = ref(db, 'VolcanoMonitoring/Readings');
const commandsRef = ref(db, 'VolcanoMonitoring/Commands');
const latestReadingQuery = query(readingsRef, orderByKey(), limitToLast(1));

export { db, readingsRef, commandsRef, latestReadingQuery };
