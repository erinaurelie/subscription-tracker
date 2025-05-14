import app from "./app.js";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

// listen to the port
app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase();
});
