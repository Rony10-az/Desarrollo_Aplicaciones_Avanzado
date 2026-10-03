import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import viewRoutes from './routes/views.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUser from './utils/seedUser.js';
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Motor de plantillas EJS y archivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar CORS para todos
app.use(cors());

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', viewRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// Ruta no encontrada
app.use((req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(404).render('pages/404', { title: 'No encontrado', active: '' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUser();
        app.listen(PORT, () => console.log(`Servidor corriendo en : http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });
