import { NotificationProvider } from './NotificationProvider.js';
import nodemailer from "nodemailer";

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
     * @example `await emailNotifier.send({ user, course, numOpen, getEmailBodyHTML }})`
     * 
     * @param {*} args 
     */
    async send(args) {
        const { user, course, numOpen, getHtmlTemplate } = args;

        await this.transporter.sendMail({
            to: user.email, 
            subject: "CLASS AVAILABLE ✔", 
            html: getHtmlTemplate(user, course, numOpen),
        });
    }
}