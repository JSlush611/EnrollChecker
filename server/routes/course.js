import express from "express";
import {
    getCourses,
    subscribeCourse,
    unsubscribeCouse,
} from "../controllers/courses.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/show", getCourses);
router.get("/subscribe/:userId/:courseId", subscribeCourse);
router.get("/unsubscribe/:userId/:courseId", unsubscribeCouse);

export default router;