import dotenv from "dotenv";
import mongoose from "mongoose";
import { registerRoutes } from './routes/index.js';
import { initializeApp  } from './initialize.js';

async function main() {
    dotenv.config();

    const { app, router } = initializeApp();

    registerRoutes(router);
    app.use(router);
    
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch((error) => console.log(`${error} did not connect`));

    const PORT = process.env.PORT || 6001;
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}

main();