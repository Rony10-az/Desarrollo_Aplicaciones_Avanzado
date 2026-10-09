// Actividad 3: Compresión de un archivo con Pipes (fs + zlib)
const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('entrada.txt');
const writeStream = fs.createWriteStream('entrada.txt.gz');
const gzip = zlib.createGzip();

readStream.pipe(gzip).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('Archivo comprimido correctamente: entrada.txt.gz');
});

readStream.on('error', (err) => console.error('Error de lectura:', err));
writeStream.on('error', (err) => console.error('Error de escritura:', err));
