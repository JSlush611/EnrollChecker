import {
    getUser,
    getUserSubscriptions,
    updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

export function registerUserRoutes(router) {
    router.get("/users/:id", verifyToken, getUser);
    router.get("/users/:id/subscriptions", verifyToken, getUserSubscriptions);
    router.patch("/users/:id/update", verifyToken, updateUser);

    return router;
}