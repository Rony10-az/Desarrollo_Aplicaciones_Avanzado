const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

//Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada peticion

// Mensaje de prueba en la raiz

app.get('/', (req, res) => {
    res.send('Bienvenido a la API RESTful');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server runnig at http://localhost:' + PORT);
})

//importamos los módulos de rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

//rutas bases
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);
