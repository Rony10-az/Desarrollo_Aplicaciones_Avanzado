// Layout raíz: envuelve TODA la app. Aquí van providers globales
// (AuthProvider) y cualquier elemento compartido (ej. fuente, metadata).

import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Sistema de Ventas',
  description: 'Gestión de productos, clientes y ventas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
