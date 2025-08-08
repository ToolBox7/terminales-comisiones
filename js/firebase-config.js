// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLeaWXEJISPhLVU6LnHQ2FU7kmmEhu7H8",
  authDomain: "comisionesyterminales.firebaseapp.com",
  projectId: "comisionesyterminales",
  storageBucket: "comisionesyterminales.firebasestorage.app",
  messagingSenderId: "53437890803",
  appId: "1:53437890803:web:bc33099a24cb296f0a7786",
  measurementId: "G-YXFKJ5N9RC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export the functions you want to use
export { db, analytics, logEvent };

// Function to log queries
export const logQuery = async () => {
  try {
    const statsRef = doc(db, "stats", "calculator");
    await updateDoc(statsRef, {
      queries: increment(1),
      lastUpdated: new Date()
    });
    logEvent(analytics, 'calculate_event');
  } catch (error) {
    console.error("Error logging query:", error);
  }
};

// Function to log ratings
export const logRating = async (stars) => {
  try {
    const statsRef = doc(db, "stats", "calculator");
    await updateDoc(statsRef, {
      ratings: arrayUnion(stars),
      lastRated: new Date()
    });
    logEvent(analytics, 'rate_event', { stars });
  } catch (error) {
    console.error("Error logging rating:", error);
  }
};