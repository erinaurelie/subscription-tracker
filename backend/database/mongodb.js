import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Please define the MONGODB_URI env variable inside .env<development/production>.local");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connect to database in ${NODE_ENV} mode`); // either prod or dev
    } catch (error) {
        console.error(`Error connecting to database ${error}`);
        process.exit(1); // Terminate with failure code
    }
}

export default connectToDatabase;