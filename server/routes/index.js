import { registerAuthRoutes } from './auth.js';
import { registerUserRoutes } from './users.js';
import { registerCourseRoutes } from './course.js';
import { registerHomeRoutes } from './home.js';

export function registerRoutes(router) {
    registerHomeRoutes(router);
    registerAuthRoutes(router);
    registerUserRoutes(router);
    registerCourseRoutes(router);
}