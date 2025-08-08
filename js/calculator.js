// Importaciones
import { logQuery, logRating } from './js/firebase-config.js';

// Elementos DOM
const montoInput = document.getElementById('monto');
const calcularBtn = document.getElementById('calcular-btn');
const resultSection = document.getElementById('result-section');
const montoIngresado = document.getElementById('monto-ingresado');
const resultsContainer = document.querySelector('.results-container');
const stars = document.querySelectorAll('.stars i');

// Datos de respaldo (en caso de error al cargar el JSON)
const backupProviders = [
    {
        id: "mercadopago",
        name: "Mercado Pago",
        logo: "img/providers/mercadopago.png",
        commission: 3.5,
        hasIVA: true,
        description: "Comisión estándar para pagos con tarjeta"
    },
    {
        id: "clip",
        name: "Clip",
        logo: "img/providers/clip.png",
        commission: 2.9,
        hasIVA: true,
        description: "Terminales físicas"
    }
];

// Cargar proveedores desde JSON local
async function loadProviders() {
    try {
        const response = await fetch('../data/providers.json');
        if (!response.ok) throw new Error('Error al cargar proveedores');
        return await response.json();
    } catch (error) {
        console.error("Error cargando proveedores:", error);
        return backupProviders;
    }
}

/**
 * Calcula las comisiones y muestra los resultados
 * @param {number} monto - Monto a calcular
 */
function calcularComisiones(monto) {
    resultsContainer.innerHTML = '';
    
    window.providers.forEach(provider => {
        // Cálculos
        const comision = monto * (provider.commission / 100);
        const iva = provider.hasIVA ? comision * 0.16 : 0;
        const comisionTotal = comision + iva;
        const montoRecibir = monto - comisionTotal;
        
        // Crear tarjeta de proveedor
        const card = document.createElement('div');
        card.className = 'provider-card';
        card.innerHTML = `
            <div class="provider-header">
                <img src="${provider.logo}" alt="${provider.name}" class="provider-logo" 
                     onerror="this.src='img/providers/default.png'">
                <div class="provider-name">${provider.name}</div>
            </div>
            <div class="result-row">
                <span>Comisión (${provider.commission}%):</span>
                <span>$${comision.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span>IVA:</span>
                <span>$${iva.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span>Comisión Total:</span>
                <span>$${comisionTotal.toFixed(2)}</span>
            </div>
            <div class="result-row">
                <span>Monto a recibir:</span>
                <span>$${montoRecibir.toFixed(2)}</span>
            </div>
            ${provider.description ? `<div class="provider-description">${provider.description}</div>` : ''}
        `;
        
        resultsContainer.appendChild(card);
    });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.providers = await loadProviders();
        console.log("Proveedores cargados:", window.providers);
        
        // Configurar evento de cálculo
        calcularBtn.addEventListener('click', handleCalculate);
        
        // Configurar estrellas de calificación
        setupRatingStars();
    } catch (error) {
        console.error("Error inicializando calculadora:", error);
    }
});

/**
 * Maneja el evento de cálculo
 */
async function handleCalculate() {
    const monto = parseFloat(montoInput.value);
    
    // Validación
    if (isNaN(monto)) {
        alert('Por favor ingresa un monto válido');
        montoInput.focus();
        return;
    }
    
    if (monto <= 0) {
        alert('El monto debe ser mayor a cero');
        montoInput.focus();
        return;
    }
    
    // Mostrar resultados
    montoIngresado.textContent = `$${monto.toFixed(2)}`;
    calcularComisiones(monto);
    resultSection.classList.remove('hidden');
    
    // Registrar consulta en Firebase
    try {
        await logQuery();
    } catch (error) {
        console.error("No se pudo registrar la consulta:", error);
        // Continúa mostrando resultados aunque falle Firebase
    }
}

/**
 * Configura los eventos de las estrellas de calificación
 */
function setupRatingStars() {
    stars.forEach(star => {
        star.addEventListener('click', async (e) => {
            const value = parseInt(e.target.dataset.value);
            
            // Actualizar visualización de estrellas
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
            
            // Registrar calificación en Firebase
            try {
                await logRating(value);
                alert(`¡Gracias por calificar con ${value} ${value === 1 ? 'estrella' : 'estrellas'}!`);
            } catch (error) {
                console.error("Error registrando calificación:", error);
                alert("Ocurrió un error al registrar tu calificación");
            }
        });
    });
}

// Manejar el evento Enter en el input
montoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculate();
    }

});
