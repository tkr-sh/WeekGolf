import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./api/v1/routes/index";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Register middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/", router);

export default app;
