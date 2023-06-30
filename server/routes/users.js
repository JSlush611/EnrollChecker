import express from "express";
import {
    getUser,
    getUserSubscriptions,
    updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/subscriptions", verifyToken, getUserSubscriptions);
router.patch("/:id/update", verifyToken, updateUser);

export default router;