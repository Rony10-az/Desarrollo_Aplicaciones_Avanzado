import express from 'express';

const router = express.Router();

// Las vistas se renderizan con EJS; los datos se cargan desde la API con fetch + JWT.
// La protección por token/rol se aplica en el cliente (public/js/api.js) y en la API.
router.get('/', (req, res) => res.render('pages/home', { title: 'Inicio', active: 'home', layout: 'home' }));

// SignIn y SignUp comparten la misma vista; solo cambia el formulario inicial.
// "role" es el rol elegido en la página de inicio (solo cambia la presentación).
const renderAuth = mode => (req, res) => {
    const role = ['admin', 'user'].includes(req.query.role) ? req.query.role : null;
    res.render('pages/auth', {
        title: mode === 'signup' ? 'Registro' : 'Iniciar sesión',
        active: mode === 'signup' ? 'signUp' : 'signIn',
        layout: 'auth',
        mode: role === 'admin' ? 'signin' : mode,
        role
    });
};
router.get('/signIn', renderAuth('signin'));
router.get('/signUp', renderAuth('signup'));
router.get('/profile', (req, res) => res.render('pages/profile', { title: 'Mi cuenta', active: 'profile' }));
router.get('/dashboard', (req, res) => res.render('pages/dashboard', { title: 'Dashboard', active: 'dashboard' }));
router.get('/admin/dashboard', (req, res) => res.render('pages/admin-dashboard', { title: 'Administración', active: 'admin' }));
router.get('/403', (req, res) => res.status(403).render('pages/403', { title: 'Acceso denegado', active: '' }));

export default router;
