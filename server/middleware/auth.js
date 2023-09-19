import jwt from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../util/statusCodes.js";

export const verifyToken = async (req, res, next) => {
    try {
        const adminKey = req.header("Admin-Key");
        if (adminKey && adminKey === process.env.ADMIN_KEY) {
            return next();
        }

        let token = req.header("Authorization");
        if (!token) {
            return res.status(HTTP_UNAUTHORIZED).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Server error verifying token! ", error);
    }
}