# SEMANA03 — Gestión de Archivos y Streams (Node.js)

Proyecto de la Semana 03: Desarrollo de Aplicaciones Web Avanzado.

## Estructura

```
SEMANA03/
├── laboratorio03/            Actividades 1 a 4 + Tarea 1 (módulos nativos: fs, zlib, stream)
│   ├── actividad1-lectura.js
│   ├── actividad2-escritura.js
│   ├── actividad3-compresion.js
│   ├── actividad4-backpressure.js
│   ├── tarea1-mayusculas.js
│   ├── datos.txt
│   ├── entrada.txt
│   └── texto.txt
└── tarea02-excel-server/     Tarea 2: servidor HTTP + exceljs
    └── server.js
```

## Cómo ejecutar

### Laboratorio 03 (actividades 1-4 y tarea 1)

No requiere instalar dependencias, solo usa módulos nativos de Node.js.

```bash
cd laboratorio03
node actividad1-lectura.js
node actividad2-escritura.js
node actividad3-compresion.js
node actividad4-backpressure.js
node tarea1-mayusculas.js
```

### Tarea 2 (servidor Excel con exceljs)

```bash
cd tarea02-excel-server
npm install
npm start
```

Luego abrir en el navegador:

- `http://localhost:3000/reporte` → descarga el archivo `reporte-ventas.xlsx`
- `http://localhost:3000/` (o cualquier otra ruta) → muestra `Visita /reporte para descargar el Excel`
# SEMANA03
