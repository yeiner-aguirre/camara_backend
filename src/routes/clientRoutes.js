const express = require('express');
const router = express.Router();
const {
    getClients,
    createClient,
    updateClient,
    deleteClient
} = require('../controllers/clientController');

// Ruta para obtener todos los clientes
router.get('/', getClients);

// Ruta para crear un cliente
router.post('/', createClient);

// Ruta para actualizar un cliente
router.put('/:id', updateClient);

// Ruta para eliminar un cliente
router.delete('/:id', deleteClient);

module.exports = router;
