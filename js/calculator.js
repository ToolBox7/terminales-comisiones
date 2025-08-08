import { db, logQuery, logRating } from './firebase-config.js';
import { getDocs, collection } from "firebase/firestore";

// Elementos DOM
const montoInput = document.getElementById('monto');
const calcularBtn = document.getElementById('calcular-btn');
const resultSection = document.getElementById('result-section');
const montoIngresado = document.getElementById('monto-ingresado');
const resultsContainer = document.querySelector('.results-container');
const stars = document.querySelectorAll('.stars i');

// Variables globales
let providers = [];

// Cargar proveedores desde Firebase
async function loadProviders() {
    try {
        const providersList = [];
        const querySnapshot = await getDocs(collection(db, "providers"));
        
        querySnapshot.forEach(doc => {
            providersList.push({ 
                id: doc.id, 
                name: doc.data().name,
                logo: doc.data().logo,
                commission: doc.data().commission,
                hasIVA: doc.data().hasIVA
            });
        });
        
        return providersList;
    } catch (error) {
        console.error("Error cargando proveedores:", error);
        return []; // Devuelve array vacío en caso de error
    }
}

// Cargar proveedores al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    const loadedProviders = await loadProviders();
    
    if (loadedProviders.length > 0) {
        providers = loadedProviders;
    } else {
        // Datos de respaldo si Firebase falla
        providers = [
            {
                id: "mercadopago",
                name: "Mercado Pago",
                logo: "img/providers/mercadopago.png",
                commission: 3.5,
                hasIVA: true
            },
            {
                id: "clip",
                name: "Clip",
                logo: "img/providers/clip.png",
                commission: 2.9,
                hasIVA: true
            }
        ];
        console.warn("Usando proveedores de respaldo");
    }
});

// Función para calcular comisiones
function calcularComisiones(monto) {
    resultsContainer.innerHTML = '';
    
    providers.forEach(provider => {
        // Cálculos (mantener igual que antes)
        const comision = monto * (provider.commission / 100);
        const iva = provider.hasIVA ? comision * 0.16 : 0;
        const comisionTotal = comision + iva;
        const montoRecibir = monto - comisionTotal;
        
        // Generar HTML (mantener igual)
        const card = document.createElement('div');
        card.className = 'provider-card';
        card.innerHTML = `
            <!-- ... (mismo HTML que antes) ... -->
        `;
        
        resultsContainer.appendChild(card);
    });
}

// Event listeners (mantener igual)
calcularBtn.addEventListener('click', () => {
    // ... (código existente)
});

// Sistema de calificación (mantener igual)
stars.forEach(star => {
    // ... (código existente)
});