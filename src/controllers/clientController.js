const { connection } = require('../config/database');

// Obtener todos los clientes
function getClients(req, res) {
    const query = `
        SELECT c.id, c.nombre, c.email, 
               CASE 
                   WHEN a.id IS NOT NULL THEN 'Sí'
                   ELSE 'No'
               END AS camara_alquilada,
               CASE 
                   WHEN c.multa_hasta >= NOW() THEN 'Sí'
                   ELSE 'No'
               END AS multa_activa
        FROM clientes c
        LEFT JOIN alquileres a ON c.id = a.id_cliente AND a.fecha_fin >= NOW();
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los clientes:', err.message);
            return res.status(500).json({ error: 'Error al obtener los clientes.' });
        }
        res.status(200).json(results);
    });
}

// Crear un nuevo cliente
function createClient(req, res) {
    const { nombre, email, multa_hasta } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios.' });
    }

    const query = 'INSERT INTO clientes (nombre, email, multa_hasta) VALUES (?, ?, ?)';
    connection.query(query, [nombre, email, multa_hasta || null], (err, results) => {
        if (err) {
            console.error('Error al crear el cliente:', err.message);
            return res.status(500).json({ error: 'Error al crear el cliente.' });
        }
        res.status(201).json({ message: 'Cliente creado exitosamente', id: results.insertId });
    });
}

// Actualizar un cliente existente
function updateClient(req, res) {
    const { id } = req.params;
    const { nombre, email, multa_hasta } = req.body;

    if (!nombre && !email && !multa_hasta) {
        return res.status(400).json({ error: 'Se requiere al menos un dato para actualizar.' });
    }

    const query = 'UPDATE clientes SET nombre = ?, email = ?, multa_hasta = ? WHERE id = ?';
    connection.query(query, [nombre, email, multa_hasta, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el cliente:', err.message);
            return res.status(500).json({ error: 'Error al actualizar el cliente.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente.' });
    });
}

// Eliminar un cliente existente
function deleteClient(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM clientes WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar el cliente:', err.message);
            return res.status(500).json({ error: 'Error al eliminar el cliente.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        res.status(200).json({ message: 'Cliente eliminado exitosamente.' });
    });
}

module.exports = { getClients, createClient, updateClient, deleteClient };
