

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

class EmailService {

    constructor() {

        this.transporter = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE,
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_SECRET_KEY,
            }
        });
    }

    async sendEmail(options) {

        const { to, subject, htmlBody } = options;

        try {
            const info = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody
            });
            console.log(" Email enviado:", info.response);
            return true;
        } catch (error) {
            console.error("Error enviando el email:", error);
            return false;
        }

    }
}

module.exports = EmailService;
