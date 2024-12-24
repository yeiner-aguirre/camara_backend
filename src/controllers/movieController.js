const { connection } = require('../config/database');

// Controlador para obtener todas las películas
function getMovies(req, res) {
    connection.query('SELECT * FROM peliculas', (err, results) => {
        if (err) {
            console.error('Error al obtener las películas:', err.message);
            return res.status(500).json({ error: 'Error al obtener las películas.' });
        }
        res.status(200).json(results);
    });
}

// Controlador para crear una nueva película
function createMovie(req, res) {
    const { marca, nombre, sensibilidad_iso, formato } = req.body;

    if (!marca || !nombre || !sensibilidad_iso || !formato) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere marca, nombre, sensibilidad_iso y formato.' });
    }

    const query = 'INSERT INTO peliculas (marca, nombre, sensibilidad_iso, formato) VALUES (?, ?, ?, ?)';
    connection.query(query, [marca, nombre, sensibilidad_iso, formato], (err, results) => {
        if (err) {
            console.error('Error al crear la película:', err.message);
            return res.status(500).json({ error: 'Error al crear la película.' });
        }
        res.status(201).json({ message: 'Película creada exitosamente', id: results.insertId });
    });
}

// Controlador para actualizar una película existente
function updateMovie(req, res) {
    const { id } = req.params;
    const { marca, nombre, sensibilidad_iso, formato } = req.body;

    if (!marca || !nombre || !sensibilidad_iso || !formato) {
        return res.status(400).json({ error: 'Datos inválidos. Se requiere marca, nombre, sensibilidad_iso y formato.' });
    }

    const query = 'UPDATE peliculas SET marca = ?, nombre = ?, sensibilidad_iso = ?, formato = ? WHERE id = ?';
    connection.query(query, [marca, nombre, sensibilidad_iso, formato, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar la película:', err.message);
            return res.status(500).json({ error: 'Error al actualizar la película.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Película no encontrada.' });
        }

        res.status(200).json({ message: 'Película actualizada exitosamente.' });
    });
}

// Controlador para eliminar una película existente
function deleteMovie(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM peliculas WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar la película:', err.message);
            return res.status(500).json({ error: 'Error al eliminar la película.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Película no encontrada.' });
        }

        res.status(200).json({ message: 'Película eliminada exitosamente.' });
    });
}

module.exports = { getMovies, createMovie, updateMovie, deleteMovie };
