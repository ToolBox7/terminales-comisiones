import { db } from './firebase-config.js';

// Elementos DOM para estadísticas
const usersEl = document.getElementById('active-users');
const queriesEl = document.getElementById('total-queries');
const ratingEl = document.getElementById('avg-rating');

// Escuchar cambios en tiempo real
db.collection('stats').doc('calculator').onSnapshot((doc) => {
  const data = doc.data();
  
  // Actualizar contador de consultas
  queriesEl.textContent = data.queries || '0';
  
  // Calcular promedio de calificaciones
  if (data.ratings && data.ratings.length > 0) {
    const sum = data.ratings.reduce((a, b) => a + b, 0);
    const avg = sum / data.ratings.length;
    ratingEl.textContent = avg.toFixed(1);
  }
});

// Usuarios en tiempo real (Google Analytics)
firebase.analytics().onAnalyticsEvent((event) => {
  if (event.name === 'active_users') {
    usersEl.textContent = event.value;
  }
});