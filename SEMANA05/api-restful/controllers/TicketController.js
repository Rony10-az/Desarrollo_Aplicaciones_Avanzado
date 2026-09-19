const TicketService = require("../services/TicketService");
const service = new TicketService();

exports.create = (req, res, next) => {
    try {
        const ticket = service.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (err) {
        next(err);
    }
};

exports.list = (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = service.list({ page, limit });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.assign = (req, res, next) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const ticket = service.assignTicket(id, user);
        res.status(200).json(ticket);
    } catch (err) {
        next(err);
    }
};

exports.changeStatus = (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ticket = service.changeStatus(id, status);
        res.status(200).json(ticket);
    } catch (err) {
        next(err);
    }
};

exports.getNotifications = (req, res, next) => {
    try {
        const notifications = service.getNotifications(req.params.id);
        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

exports.delete = (req, res, next) => {
    try {
        service.deleteTicket(req.params.id);
        res.json({ message: "Ticket eliminado correctamente" });
    } catch (err) {
        next(err);
    }
};
