const express = require('express');
const cors = require('cors');
const app = express();
const { connection } = require('./src/config/database');
const cameraRoutes = require('./src/routes/cameraRoutes');
const movieRoutes = require('./src/routes/movieRoutes');
const rentalRoutes = require('./src/routes/rentalRoutes');
const clientRoutes = require('./src/routes/clientRoutes');

app.use(express.json());

// Configuración básica de CORS
app.use(cors({
    origin: 'https://camara-front.vercel.app/', // URL de tu frontend en React
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Probar conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos exitosa.');
    }
});

// Rutas para cámaras
app.use('/api/cameras', cameraRoutes);

// Rutas para películas
app.use('/api/movies', movieRoutes);

// Rutas para alquileres
app.use('/api/rentals', rentalRoutes);

// Rutas para clientes
app.use('/api/clients', clientRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
