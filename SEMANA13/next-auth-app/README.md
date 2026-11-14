# MyAuthApp — Laboratorio de Autenticación con NextAuth.js

Aplicación Next.js (App Router) que implementa un sistema de autenticación completo con **NextAuth.js**: inicio de sesión con **Google**, **GitHub** y **correo/contraseña**, registro de usuarios, bloqueo de cuenta por intentos fallidos y protección de rutas.

## Contenido

- [Funcionalidades](#funcionalidades)
- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
  - [Google OAuth](#1-google-oauth)
  - [GitHub OAuth](#2-github-oauth)
  - [NEXTAUTH\_SECRET](#3-nextauth_secret)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Cómo funciona la autenticación](#cómo-funciona-la-autenticación)
- [Notas y limitaciones](#notas-y-limitaciones)

## Funcionalidades

- **Inicio de sesión con Google** (`GoogleProvider`)
- **Inicio de sesión con GitHub** (`GitHubProvider`)
- **Inicio de sesión con correo y contraseña** (`CredentialsProvider`)
  - Registro de nuevos usuarios con formulario propio
  - Contraseñas cifradas con **bcrypt** (nunca se guardan en texto plano)
  - **Bloqueo de la cuenta por 15 minutos** después de 5 intentos fallidos
- **Protección de rutas** (`/dashboard`, `/profile`) mediante `proxy.ts` — un usuario sin sesión es redirigido automáticamente a `/signIn`
- Sesión accesible en Server Components vía `getServerSession`, incluyendo con qué proveedor inició sesión cada usuario
- Dashboard con resumen del día (fecha, hora, proveedor usado, vigencia de la sesión) y perfil con los datos de la cuenta

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Autenticación | [NextAuth.js v4](https://next-auth.js.org/) |
| Cifrado de contraseñas | [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animaciones | [Framer Motion](https://www.framer.com/motion/) |
| Iconos | [react-icons](https://react-icons.github.io/react-icons/) |
| Lenguaje | TypeScript |

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # Configuración de NextAuth (providers, callbacks)
│   │   └── register/route.ts             # Endpoint de registro (crea usuarios con bcrypt)
│   ├── components/
│   │   ├── LogoutButton.tsx              # Botón de cerrar sesión
│   │   ├── SessionProvider.tsx           # Wrapper de <SessionProvider> de next-auth
│   │   ├── TiltCard.tsx                  # Tarjeta con efecto 3D al mover el mouse
│   │   └── Reveal.tsx                    # Animaciones de entrada en cascada
│   ├── dashboard/page.tsx                # Panel protegido con resumen de la sesión
│   ├── profile/page.tsx                  # Perfil del usuario autenticado
│   ├── signIn/page.tsx                   # Login (Google, GitHub y credenciales)
│   ├── register/page.tsx                 # Formulario de registro
│   ├── layout.tsx                        # Layout raíz + navbar
│   └── page.tsx                          # Redirige a /dashboard
├── lib/
│   └── users.ts                          # Store de usuarios en memoria (hash, intentos, bloqueo)
├── types/
│   └── next-auth.d.ts                    # Tipado extendido de la sesión (campo `provider`)
└── proxy.ts                              # Protección de rutas (reemplaza a middleware.ts en Next.js 16)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) 18.18 o superior
- Una cuenta de Google y una de GitHub (para crear las credenciales OAuth)

## Instalación

```bash
git clone https://github.com/Rony10-az/Desarrollo_Aplicaciones_Avanzado.git
cd Desarrollo_Aplicaciones_Avanzado/SEMANA13/next-auth-app
npm install
```

## Variables de entorno

Crea un archivo **`.env.local`** en la raíz del proyecto con este contenido:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 1. Google OAuth

1. Entra a [Google Cloud Console → Credentials](https://console.developers.google.com/apis/credentials).
2. Crea un proyecto nuevo (si no tienes uno).
3. **Create Credentials → OAuth client ID** → tipo *Web application*.
4. En **Authorized redirect URIs** agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Copia el **Client ID** y **Client Secret** generados a `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
6. Si la pantalla de consentimiento está en modo **Testing**, agrega tu correo en **Test users** o no podrás iniciar sesión.

### 2. GitHub OAuth

1. Entra a [GitHub → Settings → Developer settings](https://github.com/settings/developers) y crea una **OAuth App** (o GitHub App).
2. **Homepage URL:**
   ```
   http://localhost:3000
   ```
3. **Authorization callback URL:**
   ```
   http://localhost:3000/api/auth/callback/github
   ```
4. Copia el **Client ID** a `GITHUB_CLIENT_ID` y genera un **Client Secret** para `GITHUB_CLIENT_SECRET`.

### 3. NEXTAUTH_SECRET

Genera una clave aleatoria para firmar las sesiones:

```bash
openssl rand -base64 32
```

O usa el generador online: https://generate-secret.vercel.app/32

Pega el resultado en `NEXTAUTH_SECRET`.

## Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La app redirige automáticamente a `/signIn` si no hay una sesión activa.

Otros comandos disponibles:

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # ESLint
```

## Rutas de la aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Redirige a `/dashboard` | Público |
| `/signIn` | Inicio de sesión (Google, GitHub, credenciales) | Público |
| `/register` | Registro de nuevos usuarios | Público |
| `/dashboard` | Panel con resumen de la sesión | **Requiere sesión** |
| `/profile` | Datos del usuario autenticado | **Requiere sesión** |
| `/api/auth/*` | Endpoints de NextAuth | — |
| `/api/register` | Crea un usuario nuevo (POST) | — |

## Cómo funciona la autenticación

- **Google / GitHub:** `signIn('google' | 'github')` redirige al proveedor; al volver, NextAuth crea la sesión (JWT) automáticamente.
- **Credenciales:**
  1. El usuario se registra en `/register` → `POST /api/register` valida los datos y guarda el usuario con la contraseña **hasheada con bcrypt** (`src/lib/users.ts`).
  2. Al iniciar sesión, `CredentialsProvider.authorize()` (en `route.ts`) busca el usuario, compara el hash con `bcrypt.compare` y:
     - Si falla, incrementa un contador de intentos.
     - Al llegar a **5 intentos fallidos**, bloquea la cuenta por **15 minutos** (incluso si luego se ingresa la contraseña correcta).
     - Si el intento es correcto, reinicia el contador.
- En ambos casos, la sesión guarda qué **proveedor** se usó (`session.user.provider`), y el dashboard/perfil lo muestran con su ícono correspondiente.
- `proxy.ts` protege `/dashboard` y `/profile`: si no hay sesión, redirige a `/signIn`.

## Notas y limitaciones

- **Almacenamiento en memoria:** los usuarios registrados por credenciales se guardan en un `Map` en memoria (`src/lib/users.ts`), no en una base de datos. Esto es suficiente para este laboratorio, pero significa que **los usuarios se pierden al reiniciar el servidor**. Para producción, reemplaza este store por una base de datos real (Postgres, MongoDB, etc.) manteniendo la misma interfaz de funciones.
- **Next.js 16 — Proxy:** esta versión de Next.js renombró `middleware.ts` a `proxy.ts` (la funcionalidad es la misma). Si ves referencias a "middleware" en tutoriales antiguos de NextAuth, en este proyecto equivale a `src/proxy.ts`.
- El archivo `AGENTS.md` en la raíz lo genera automáticamente `next dev` para asistentes de IA; no requiere edición manual.
