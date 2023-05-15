import mysql from 'mysql2';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
})

// Create a MySQL pool
const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "weekgolf",
    multipleStatements: true
});

export default conn;
