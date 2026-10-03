import authService from '../services/AuthService.js';

// Evita inyección NoSQL: email y password deben ser texto, nunca objetos como {"$ne": null}
const validCredentials = (email, password) =>
    typeof email === 'string' && email.trim() !== '' &&
    typeof password === 'string' && password !== '';

class AuthController {

    async signUp(req, res, next) {
        try {
            const payload = req.body;
            if (!validCredentials(payload.email, payload.password))
                return res.status(400).json({ message: 'El email y password son requeridos' });

            const user = await authService.signUp(payload);
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!validCredentials(email, password))
                return res.status(400).json({ message: 'El email y password son requeridos' });

            const token = await authService.signIn({ email, password });
            return res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
