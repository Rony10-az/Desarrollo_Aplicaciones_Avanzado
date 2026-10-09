// Tarea 1: Transformar un archivo de texto a mayúsculas con Streams
const fs = require('fs');
const { Transform } = require('stream');

const convertirAMayusculas = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

const readable = fs.createReadStream('texto.txt', { encoding: 'utf8' });
const writable = fs.createWriteStream('texto_mayusculas.txt');

readable.pipe(convertirAMayusculas).pipe(writable);

writable.on('finish', () => {
  console.log('Archivo convertido a mayúsculas: texto_mayusculas.txt');
});

readable.on('error', (err) => console.error('Error de lectura:', err));
writable.on('error', (err) => console.error('Error de escritura:', err));
