import mysql from "mysql2";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "weekgolf",
  multipleStatements: true,
});

export default conn;
