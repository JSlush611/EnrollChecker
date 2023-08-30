import {
    getCourses,
    subscribeCourse,
    unsubscribeCouse,
} from "../controllers/courses.js"
import { verifyToken } from "../middleware/auth.js";

export function registerCourseRoutes(router) {
    router.get("/courses/show", verifyToken, getCourses);
    router.get("/courses/subscribe/:userId/:courseId", verifyToken, subscribeCourse);
    router.get("/courses/unsubscribe/:userId/:courseId", verifyToken, unsubscribeCouse);

    return router;
}