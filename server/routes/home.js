import { getHome } from "./../controllers/homeController.js";

export function registerHomeRoutes(router) {
    router.get("/", getHome);

    return router;
}