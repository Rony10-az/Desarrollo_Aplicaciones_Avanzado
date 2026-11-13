// Página raíz "/". Punto de entrada de la app: si hay sesión redirige
// a /dashboard, si no a /login. Por ahora solo un placeholder.

export default function HomePage() {
  return (
    <main>
      <h1>Sistema de Ventas</h1>
      {/* TODO: redirigir según useAuth().usuario a /dashboard o /login */}
    </main>
  );
}
