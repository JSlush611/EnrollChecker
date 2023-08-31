import jwt from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../statusCodes.js";
export const verifyToken = async (req, res, next) => {
    try {
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
    } catch (err) {
        res.render(HTTP_UNAUTHORIZED, { errorMessage: `Access Denied!` });
    }
}