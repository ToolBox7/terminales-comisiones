1. Instala Node.js desde https://nodejs.org/
2. Descarga el archivo credentials.json de Google Cloud y colócalo en esta carpeta.
3. Coloca tu property ID de Google Analytics 4 en metrics.js (ejemplo: properties/123456789).
4. Instala dependencias:
   npm install @google-analytics/data express cors dotenv
5. Ejecuta el servidor:
   node metrics.js
6. Tu frontend puede consultar http://localhost:3000/api/metrics para obtener los datos.
