import NextAuth, { type Account, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  findUserByEmail,
  isLocked,
  lockRemainingMinutes,
  registerFailedAttempt,
  resetAttempts,
  verifyPassword,
} from "@/lib/users";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ingresa tu correo y tu contraseña.");
        }

        const user = findUserByEmail(credentials.email);
        if (!user) {
          throw new Error("Correo o contraseña incorrectos.");
        }

        if (isLocked(user)) {
          throw new Error(
            `Cuenta bloqueada por varios intentos fallidos. Intenta de nuevo en ${lockRemainingMinutes(user)} min.`
          );
        }

        const valid = await verifyPassword(user, credentials.password);
        if (!valid) {
          registerFailedAttempt(user);
          if (isLocked(user)) {
            throw new Error(
              `Demasiados intentos fallidos. Cuenta bloqueada por ${lockRemainingMinutes(user)} min.`
            );
          }
          throw new Error("Correo o contraseña incorrectos.");
        }

        resetAttempts(user);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.provider = token.provider;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
