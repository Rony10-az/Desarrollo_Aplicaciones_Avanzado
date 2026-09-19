const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
    constructor() {
        this.repo = new TicketRepository();
        this.notificationService = new NotificationService();
    }

    createTicket(data) {
        const ticket = {
            id: uuidv4(),
            title: data.title,
            description: data.description,
            status: "nuevo",
            priority: data.priority || "medium",
            assignedUser: null
        };

        this.repo.save(ticket);
        this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

        return ticket;
    }

    assignTicket(id, user) {
        const ticket = this.repo.update(id, { assignedUser: user });
        if (!ticket) {
            const error = new Error("Ticket no encontrado");
            error.statusCode = 404;
            throw error;
        }
        this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
        return ticket;
    }

    changeStatus(id, newStatus) {
        const ticket = this.repo.update(id, { status: newStatus });
        if (!ticket) {
            const error = new Error("Ticket no encontrado");
            error.statusCode = 404;
            throw error;
        }
        this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
        return ticket;
    }

    list({ page = 1, limit = 10 } = {}) {
        const tickets = this.repo.findAll();

        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Number(limit) || 10);
        const start = (pageNum - 1) * limitNum;

        return {
            data: tickets.slice(start, start + limitNum),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: tickets.length,
                totalPages: Math.max(1, Math.ceil(tickets.length / limitNum))
            }
        };
    }

    getNotifications(id) {
        const ticket = this.repo.findById(id);
        if (!ticket) {
            const error = new Error("Ticket no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return this.notificationService.listByTicket(id);
    }

    deleteTicket(id) {
        const deleted = this.repo.delete(id);
        if (!deleted) {
            const error = new Error("Ticket no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

module.exports = TicketService;
