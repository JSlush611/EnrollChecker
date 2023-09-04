import { verifyToken } from "../middleware/auth.js";
import { pollClasses } from "../controllers/coursePoller.js";

export function registerPollingRoutes(router) {
    router.get("/admin/pollcourses", verifyToken, pollClasses)

    return router;
}