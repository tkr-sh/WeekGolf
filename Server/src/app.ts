import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './api/v1/routes/index';
import pool from './config/initDB';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Register middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

// // Connect to MySQL database
// pool.getConnection((err) => {
//     if (err) {
//         console.error(`Error connecting to MySQL database: ${err}`);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });
    
    

export default app;