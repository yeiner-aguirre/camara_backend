-- Tabla de multas
CREATE TABLE IF NOT EXISTS multas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    activa TINYINT(1) DEFAULT 1,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
