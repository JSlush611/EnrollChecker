
import { login } from "./../controllers/auth.js";
import { getLogin } from "./../controllers/homeController.js";
import { register } from "./../controllers/auth.js";

export function registerAuthRoutes(router) {
    router.get("/auth/login", getLogin);
    router.post("/auth/login", login);
    router.post("/auth/register", register);

    return router;
}