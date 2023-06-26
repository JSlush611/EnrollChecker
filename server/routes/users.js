import express from "express";
import {
    getUser,
    getUserSubscriptions,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/:id/subscriptions", getUserSubscriptions);

export default router;