const { connection } = require('../config/database');

// Controlador para obtener todas las cámaras
function getCameras(req, res) {
    connection.query('SELECT * FROM camaras', (err, results) => {
        if (err) {
            console.error('Error al obtener las cámaras:', err.message);
            return res.status(500).json({ error: 'Error al obtener las cámaras.' });
        }
        res.status(200).json(results);
    });
}

// Controlador para crear una nueva cámara
function createCamera(req, res) {
    const { marca, modelo, soporte_flash } = req.body;

    if (!marca || !modelo || !soporte_flash) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere marca, modelo y soporte_flash.' });
    }

    // Ya no necesitamos convertir a booleano, usamos el valor 'si'/'no' directamente
    const query = 'INSERT INTO camaras (marca, modelo, soporte_flash) VALUES (?, ?, ?)';
    connection.query(query, [marca, modelo, soporte_flash], (err, results) => {
        if (err) {
            console.error('Error al crear la cámara:', err.message);
            return res.status(500).json({ error: 'Error al crear la cámara.' });
        }
        res.status(201).json({ 
            message: 'Cámara creada exitosamente', 
            id: results.insertId,
            camera: {
                id: results.insertId,
                marca,
                modelo,
                soporte_flash
            }
        });
    });
}

// Controlador para actualizar una cámara
function updateCamera(req, res) {
    const { id } = req.params;
    const { marca, modelo, soporte_flash } = req.body;

    if (!marca || !modelo || typeof soporte_flash !== 'boolean') {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere marca, modelo y soporte_flash.' });
    }

    const query = 'UPDATE camaras SET marca = ?, modelo = ?, soporte_flash = ? WHERE id = ?';
    connection.query(query, [marca, modelo, soporte_flash, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar la cámara:', err.message);
            return res.status(500).json({ error: 'Error al actualizar la cámara.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cámara no encontrada.' });
        }

        res.status(200).json({ message: 'Cámara actualizada exitosamente.' });
    });
}

// Controlador para eliminar una cámara
function deleteCamera(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM camaras WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar la cámara:', err.message);
            return res.status(500).json({ error: 'Error al eliminar la cámara.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cámara no encontrada.' });
        }

        res.status(200).json({ message: 'Cámara eliminada exitosamente.' });
    });
}
 module.exports = {getCameras, createCamera, updateCamera, deleteCamera};