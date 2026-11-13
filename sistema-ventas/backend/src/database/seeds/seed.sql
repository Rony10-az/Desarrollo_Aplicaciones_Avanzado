-- Datos de prueba para desarrollo local. No usar en producción.

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Teclado mecánico', 'Switches rojos, retroiluminado', 189.90, 25),
  ('Mouse inalámbrico', 'Sensor óptico 1600 DPI', 59.90, 50),
  ('Monitor 24"', 'Full HD, 75Hz', 649.00, 10);

INSERT INTO clientes (nombre, email, telefono, documento) VALUES
  ('Juan Pérez', 'juan.perez@example.com', '999111222', '70123456'),
  ('María López', 'maria.lopez@example.com', '999333444', '70234567');
