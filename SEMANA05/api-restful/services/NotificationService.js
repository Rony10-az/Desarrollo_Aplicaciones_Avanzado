const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("../services/email/Emailservice");

class NotificationService {
    constructor() {
        this.repo = new NotificationRepository();
        this.emailService = new EmailService();
    }

    list() {
        return this.repo.findAll();
    }

    listByTicket(ticketId) {
        return this.repo.findByTicketId(ticketId);
    }

    create(type, message, ticketId) {
        const notification = {
            id: uuidv4(),
            type,
            message,
            status: "pending",
            ticketId
        };

        if (type === "email") {
            this.emailService.sendEmail({
                to: process.env.NOTIFICATION_EMAIL_TO,
                subject: "API RESTful - Alertas del sistema de Tickets",
                htmlBody: "<h1>" + message + "</h1>"
            });
        }

        return this.repo.save(notification);
    }

}
module.exports = NotificationService;
