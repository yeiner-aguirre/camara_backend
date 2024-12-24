const express = require('express');
const router = express.Router();
const { getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');

// Ruta para obtener todas las películas
router.get('/', getMovies);

// Ruta para crear una nueva película
router.post('/', createMovie);

// Ruta para actualizar una película existente
router.put('/:id', updateMovie);

// Ruta para eliminar una película existente
router.delete('/:id', deleteMovie);

module.exports = router;
