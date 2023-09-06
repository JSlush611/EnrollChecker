import { pollClasses } from "../controllers/coursePoller.js";
import { verifyAdminToken } from "../middleware/admin.js";

export function registerPollingRoutes(router) {
    router.get("/admin/pollcourses", verifyAdminToken, pollClasses)

    return router;
}