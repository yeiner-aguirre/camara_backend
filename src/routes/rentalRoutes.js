const express = require('express');
const router = express.Router();
const { getRentals, createRental, updateRental, deleteRental } = require('../controllers/rentalController');

// Ruta para obtener todos los alquileres
router.get('/', getRentals);

// Ruta para crear un nuevo alquiler
router.post('/', createRental);

// Ruta para actualizar un alquiler existente
router.put('/:id', updateRental);

// Ruta para eliminar un alquiler existente
router.delete('/:id', deleteRental);

module.exports = router;