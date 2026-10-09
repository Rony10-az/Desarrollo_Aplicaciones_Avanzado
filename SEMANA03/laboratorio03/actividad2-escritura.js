// Actividad 2: Escritura en un archivo usando Streams
const fs = require('fs');

const writable = fs.createWriteStream('salida.txt');

writable.write('Este es un mensaje de prueba.\n');
writable.end('Fin del mensaje.');

writable.on('finish', () => {
  console.log('Escritura completa.');
});

writable.on('error', (err) => {
  console.error('Error:', err);
});
