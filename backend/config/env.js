import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }); // this extracts all the environmnet variables then we can export them

export const { 
    PORT, 
    SERVER_URL,
    NODE_ENV, 
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_KEY, ARCJET_ENV,
    QSTASH_URL, QSTASH_TOKEN, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY,
    EMAIL_PASSWORD
} = process.env;

// the config() is used to load environment variables from a specific .env file the path option specifies which .env file to load. In this case it dynamically selects the file based on the NODE_ENV file. if it is set to 'production' it will load .env.production.local

// after loading it extracts the PORT and the NODE_ENV from process.env and exports them

// this ensures our app uses the correct config for the current envirnoment
