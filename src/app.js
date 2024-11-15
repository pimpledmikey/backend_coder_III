import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";

import { errorHandle } from "./errors/errHandle.js";

import { logger } from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swagger.config.js";
import envs from "./config/envs.config.js";

const app = express();

import { connectMongoDB } from "./config/mongoDB.config.js";

//const PORT = process.env.PORT || 8080;
//const connection = mongoose.connect(`mongodb://localhost:27017/mascotasENT`);
connectMongoDB();

app.use(express.json());

app.use(cookieParser());
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use("/api", router);
app.use(errorHandle);


//app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
const httpServer = app.listen(envs.PORT, () => {
    console.log(`Server on port ${envs.PORT}`);
});