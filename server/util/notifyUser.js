import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getEmailBodyHTML } from "./getEmailHTML.js";
dotenv.config();

async function sendClassAvailabilityNotification(user, course, numOpen) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.GOOGLE_APP
        }
    });

    const info = await transporter.sendMail({
        to: user.email, 
        subject: "CLASS AVAILABLE ✔", 
        html: getEmailBodyHTML(user, course, numOpen),
    });

}

export { sendClassAvailabilityNotification };