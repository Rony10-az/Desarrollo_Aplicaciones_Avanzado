'use client';

// Página /dashboard: resumen general tras iniciar sesión
// (ej. total de ventas del día, productos con bajo stock).
// Requiere sesión activa (useAuth().usuario); si no hay, redirigir a /login.

export default function DashboardPage() {
  // TODO: traer métricas resumidas (ventas.service, productos.service)
  return (
    <main>
      <h1>Panel principal</h1>
    </main>
  );
}
