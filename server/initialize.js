import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";

export function initializeApp() {
    const app = express();
    const router = express.Router();

    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    app.use(express.json());
    app.use(cors());
    app.use(morgan("common"));
    app.use(helmet());
    app.use(helmet.crossOriginResourcePolicy({ police: "cross-origin" }));
    
    app.use(bodyParser.json({ limit: "30mb", extended: true }));
    app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

    app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    return { app, router };
}