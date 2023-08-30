
import { login } from "./../controllers/auth.js";
import { getLogin } from "./../controllers/homeController.js";

export function registerAuthRoutes(router) {
    router.get("/login", getLogin);
    router.post("/login", login);

    return router;
}