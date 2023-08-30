import {
    getCourses,
    subscribeCourse,
    unsubscribeCouse,
} from "../controllers/courses.js"
import { verifyToken } from "../middleware/auth.js";

export function registerCourseRoutes(router) {
    router.get("/show", verifyToken, getCourses);
    router.get("/subscribe/:userId/:courseId", verifyToken, subscribeCourse);
    router.get("/unsubscribe/:userId/:courseId", verifyToken, unsubscribeCouse);

    return router;
}