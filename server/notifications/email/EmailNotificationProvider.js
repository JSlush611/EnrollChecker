import nodemailer from "nodemailer";
import { emailNotificationTemplate } from './emailNotificationTemplate.js';

export class EmailNotificationProvider {
    transporter = null;

    static Create() {
        return new this();
    }

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.HOST_EMAIL,
                pass: process.env.GOOGLE_APP
            }
        });
    }

    /**
     * @example `await emailNotifier.send({ user, course, numOpen }})`
     * 
     * @param {*} args 
     */
    async send(args) {
        const { user, course, numOpen } = args;

        await this.transporter.sendMail({
            to: user.email, 
            subject: "CLASS AVAILABLE ✔", 
            html: emailNotificationTemplate(user, course, numOpen),
        });
    }
}