// Actividad 4: Manejo de errores y backpressure
const fs = require('fs');

const readable = fs.createReadStream('entrada.txt');
const writable = fs.createWriteStream('salida-backpressure.txt');

readable.on('data', (chunk) => {
  const puedeSeguir = writable.write(chunk);

  if (!puedeSeguir) {
    console.log('El destino está saturado, se pausa la lectura...');
    readable.pause();
  }
});

writable.on('drain', () => {
  console.log('El destino se liberó, se reanuda la lectura...');
  readable.resume();
});

readable.on('end', () => {
  writable.end();
  console.log('Lectura y escritura finalizadas.');
});

readable.on('error', (err) => console.error('Error de lectura:', err));
writable.on('error', (err) => console.error('Error de escritura:', err));
