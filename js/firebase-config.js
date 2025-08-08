// Importaciones de Firebase (SDK modular v9+)
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    doc, 
    updateDoc,
    increment,
    arrayUnion,
    getDoc
} from "firebase/firestore";

// Configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyDLeaWXEJISPhLVU6LnHQ2FU7kmmEhu7H8",
  authDomain: "comisionesyterminales.firebaseapp.com",
  projectId: "comisionesyterminales",
  storageBucket: "comisionesyterminales.firebasestorage.app",
  messagingSenderId: "53437890803",
  appId: "1:53437890803:web:bc33099a24cb296f0a7786",
  measurementId: "G-YXFKJ5N9RC"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Registra una consulta en Firebase Firestore
 * @returns {Promise<void>}
 */
export const logQuery = async () => {
    try {
        const statsRef = doc(db, "stats", "calculator");
        await updateDoc(statsRef, {
            queries: increment(1),
            lastUpdated: new Date()
        });
        console.log("Consulta registrada exitosamente");
    } catch (error) {
        console.error("Error al registrar consulta:", error);
        throw error;
    }
};

/**
 * Registra una calificación en Firebase Firestore
 * @param {number} stars - Número de estrellas (1-5)
 * @returns {Promise<void>}
 */
export const logRating = async (stars) => {
    try {
        const statsRef = doc(db, "stats", "calculator");
        
        // 1. Agregar la nueva calificación al array
        await updateDoc(statsRef, {
            ratings: arrayUnion(stars),
            lastRated: new Date()
        });
        
        // 2. Calcular nuevo promedio
        const docSnap = await getDoc(statsRef);
        const ratings = docSnap.data()?.ratings || [];
        const total = ratings.reduce((sum, val) => sum + val, 0);
        const avg = ratings.length > 0 ? total / ratings.length : 0;
        
        // 3. Actualizar el promedio
        await updateDoc(statsRef, {
            avg_rating: avg
        });
        
        console.log(`Calificación de ${stars} estrellas registrada`);
    } catch (error) {
        console.error("Error al registrar calificación:", error);
        throw error;
    }
};

// Exportar la instancia de Firestore por si se necesita
export { db };