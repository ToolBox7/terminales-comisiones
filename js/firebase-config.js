// Reemplaza con tus datos de Firebase Console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLeaWXEJISPhLVU6LnHQ2FU7kmmEhu7H8",
  authDomain: "comisionesyterminales.firebaseapp.com",
  projectId: "comisionesyterminales",
  storageBucket: "comisionesyterminales.firebasestorage.app",
  messagingSenderId: "53437890803",
  appId: "1:53437890803:web:bc33099a24cb296f0a7786",
  measurementId: "G-YXFKJ5N9RC"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();

// Función para registrar consultas
export const logQuery = async () => {
  try {
    await db.collection('stats').doc('calculator').update({
      queries: firebase.firestore.FieldValue.increment(1),
      lastUpdated: new Date()
    });
    analytics.logEvent('calculate_event');
  } catch (error) {
    console.error("Error registrando consulta:", error);
  }
};

// Registrar calificación
export const logRating = async (stars) => {
    try {
        const ratingRef = doc(db, "stats", "calculator");
        await updateDoc(ratingRef, {
            ratings: arrayUnion(stars),
            lastRated: new Date()
        });
        
        // Calcular nuevo promedio
        const docSnap = await getDoc(ratingRef);
        const ratings = docSnap.data().ratings || [];
        const total = ratings.reduce((sum, val) => sum + val, 0);
        const avg = total / ratings.length;
        
        await updateDoc(ratingRef, {
            avg_rating: avg
        });
        
    } catch (error) {
        console.error("Error registrando calificación:", error);
    }
};