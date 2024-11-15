import dotenv from "dotenv";
const environment = "DEV";


dotenv.config();

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL
};