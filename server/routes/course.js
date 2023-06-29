import express from "express";
import {
    getCourses,
    subscribeCourse,
    unsubscribeCouse,
} from "../controllers/courses.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/show", verifyToken, getCourses);
router.get("/subscribe/:userId/:courseId", verifyToken, subscribeCourse);
router.get("/unsubscribe/:userId/:courseId", verifyToken, unsubscribeCouse);

export default router;