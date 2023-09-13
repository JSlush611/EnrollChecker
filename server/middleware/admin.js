import { HTTP_UNAUTHORIZED } from "../util/statusCodes.js"

export const verifyAdminToken = async (req, res, next) => {
    try {
        const adminKey = req.header("Admin-Key");
        if (adminKey && adminKey === process.env.ADMIN_KEY) {
            return next();
        } else {
            res.status(HTTP_UNAUTHORIZED).send("Action not permitted!");
        }
    } catch (error) {
        console.error("Error verifying admin token! ", error);
    }
};