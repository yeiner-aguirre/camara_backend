const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'sql10.freemysqlhosting.net',
    user: process.env.DB_USER || 'sql10753916',
    password: process.env.DB_PASSWORD || 'RDfm1eqR3a',
    database: process.env.DB_NAME || 'sql10753916',
});

function connectToDatabase() {
    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err.message);
            process.exit(1);
        }
        console.log('Conexión a la base de datos establecida.');
    });
}

module.exports = { connection, connectToDatabase };
