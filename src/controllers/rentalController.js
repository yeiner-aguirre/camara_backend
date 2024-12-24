// rentalController.js
const { connection } = require('../config/database');

// Controlador para obtener todos los alquileres
function getRentals(req, res) {
    const query = `
        SELECT a.*, 
               CASE 
                   WHEN a.fecha_fin < NOW() THEN 'Retrasado' 
                   ELSE 'A tiempo' 
               END AS estado,
               CASE 
                   WHEN c.multa_hasta >= NOW() THEN CONCAT('Multa activa hasta ', c.multa_hasta)
                   ELSE 'Sin multas'
               END AS multa
        FROM alquileres a
        LEFT JOIN clientes c ON a.id_cliente = c.id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los alquileres:', err.message);
            return res.status(500).json({ error: 'Error al obtener los alquileres.' });
        }
        res.status(200).json(results);
    });
}

// Controlador para crear un nuevo alquiler
function createRental(req, res) {
    const { id_cliente, id_item, fecha_inicio, fecha_fin } = req.body;

    if (!id_cliente || !id_item || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere id_cliente, id_item, fecha_inicio y fecha_fin.' });
    }

    // Validar que el cliente no tenga multas activas
    const multaQuery = 'SELECT * FROM clientes WHERE id = ? AND multa_hasta >= NOW()';
    connection.query(multaQuery, [id_cliente], (err, results) => {
        if (err) {
            console.error('Error al verificar multas:', err.message);
            return res.status(500).json({ error: 'Error al verificar multas del cliente.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'El cliente tiene una multa activa y no puede alquilar cámaras.' });
        }

        // Validar que el cliente no tenga otro alquiler activo
        const validateQuery = 'SELECT * FROM alquileres WHERE id_cliente = ? AND fecha_fin >= NOW()';
        connection.query(validateQuery, [id_cliente], (err, results) => {
            if (err) {
                console.error('Error al validar el alquiler del cliente:', err.message);
                return res.status(500).json({ error: 'Error al validar el alquiler del cliente.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'El cliente ya tiene un alquiler activo.' });
            }

            // Insertar nuevo alquiler
            const insertQuery = 'INSERT INTO alquileres (id_cliente, id_item, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [id_cliente, id_item, fecha_inicio, fecha_fin], (err, results) => {
                if (err) {
                    console.error('Error al crear el alquiler:', err.message);
                    return res.status(500).json({ error: 'Error al crear el alquiler.' });
                }
                res.status(201).json({ message: 'Alquiler creado exitosamente', id: results.insertId });
            });
        });
    });
}

// Controlador para actualizar un alquiler existente
function updateRental(req, res) {
    const { id } = req.params;
    const { fecha_fin } = req.body;

    if (!fecha_fin) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere fecha_fin.' });
    }

    const query = 'UPDATE alquileres SET fecha_fin = ? WHERE id = ?';
    connection.query(query, [fecha_fin, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el alquiler:', err.message);
            return res.status(500).json({ error: 'Error al actualizar el alquiler.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Alquiler no encontrado.' });
        }

        // Verificar si hay retraso y registrar multa si aplica
        const multaQuery = `
            UPDATE clientes
            SET multa_hasta = DATE_ADD(NOW(), INTERVAL 7 DAY)
            WHERE id = (SELECT id_cliente FROM alquileres WHERE id = ? AND fecha_fin < NOW());
        `;

        connection.query(multaQuery, [id], (err) => {
            if (err) {
                console.error('Error al registrar la multa:', err.message);
            }
            res.status(200).json({ message: 'Alquiler actualizado exitosamente.' });
        });
    });
}

// Controlador para eliminar un alquiler existente
function deleteRental(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM alquileres WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar el alquiler:', err.message);
            return res.status(500).json({ error: 'Error al eliminar el alquiler.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Alquiler no encontrado.' });
        }

        res.status(200).json({ message: 'Alquiler eliminado exitosamente.' });
    });
}

module.exports = { getRentals, createRental, updateRental, deleteRental };

