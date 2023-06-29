import express from "express";
import {
    getUser,
    getUserSubscriptions,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/subscriptions", verifyToken, getUserSubscriptions);

export default router;