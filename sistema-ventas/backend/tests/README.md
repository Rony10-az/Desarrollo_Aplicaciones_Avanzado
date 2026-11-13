# Tests del backend

- `unit/` — pruebas unitarias de services (lógica de negocio), mockeando los
  repositorios para no tocar la base de datos real.
- `integration/` — pruebas de integración con Supertest sobre `src/app.js`,
  levantan peticiones HTTP reales contra las rutas (ideal con una base de
  datos de pruebas aparte).

```bash
npm test
```
