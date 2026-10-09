// Tarea 2: Uso de Streams con módulos externos (exceljs)
// Servidor HTTP en el puerto 3000 que expone /reporte para descargar
// un archivo Excel generado en memoria y enviado al cliente en streaming.

const http = require('http');
const ExcelJS = require('exceljs');

const PUERTO = 3000;

const PRODUCTOS = [
  'Teclado mecánico', 'Mouse inalámbrico', 'Monitor 24"', 'Laptop 15"',
  'Impresora láser', 'Router Wi-Fi', 'Webcam HD', 'Audífonos bluetooth',
  'Micrófono USB', 'Tablet 10"', 'Disco SSD 1TB', 'Memoria RAM 16GB',
  'Cargador USB-C', 'Parlantes bluetooth', 'Silla gamer', 'Escritorio',
  'Cable HDMI', 'Mousepad XL', 'Estabilizador de voltaje', 'Ventilador USB',
];

function generarFilasDeVentas() {
  return PRODUCTOS.map((producto) => ({
    producto,
    cantidad: Math.floor(Math.random() * 50) + 1,
    precio: Number((Math.random() * 480 + 20).toFixed(2)),
  }));
}

async function generarReporteExcel(res) {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet('Ventas');

  hoja.columns = [
    { header: 'Producto', key: 'producto', width: 28 },
    { header: 'Cantidad', key: 'cantidad', width: 12 },
    { header: 'Precio', key: 'precio', width: 12 },
  ];

  generarFilasDeVentas().forEach((fila) => hoja.addRow(fila));

  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename="reporte-ventas.xlsx"',
  });

  // exceljs escribe el workbook directamente sobre el stream de respuesta
  await workbook.xlsx.write(res);
  res.end();
}

const server = http.createServer((req, res) => {
  if (req.url === '/reporte') {
    generarReporteExcel(res).catch((err) => {
      console.error('Error al generar el reporte:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('Ocurrió un error al generar el archivo Excel.');
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Visita /reporte para descargar el Excel');
});

server.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
