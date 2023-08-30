
import { login } from "./../controllers/auth.js";
import { getLogin } from "./../controllers/homeController.js";

export function registerAuthRoutes(router) {
    router.get("/auth/login", getLogin);
    router.post("/auth/login", login);

    return router;
}