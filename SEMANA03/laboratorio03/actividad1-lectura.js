// Actividad 1: Lectura de un archivo usando Streams
const fs = require('fs');

const readable = fs.createReadStream('datos.txt', { encoding: 'utf8' });

readable.on('data', (chunk) => {
  console.log('Fragmento Recibido:', chunk);
});

readable.on('end', () => {
  console.log('Lectura completa');
});

readable.on('error', (err) => {
  console.error('Error:', err);
});
