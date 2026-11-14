import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../app/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/app/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="sticky top-0 z-20 w-full border-b border-white/10 bg-zinc-950/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-zinc-950">
                A
              </span>
              <span className="font-mono text-lg font-semibold tracking-tight text-white">
                MyAuth<span className="text-accent">App</span>
              </span>
            </Link>

            <ul className="flex items-center gap-7 text-sm font-medium text-zinc-400">
              <li>
                <Link
                  href="/dashboard"
                  className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                >
                  Dashboard
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link
                    href="/profile"
                    className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Profile
                  </Link>
                </li>
              )}
              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}
              {session?.user?.image && (
                <li>
                  <Image
                    height={32}
                    width={32}
                    src={session?.user?.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full ring-2 ring-accent/60 ring-offset-2 ring-offset-zinc-950"
                  />
                </li>
              )}
            </ul>
          </div>
        </nav>
        <Provider>
          <main className="min-h-[calc(100dvh-65px)]">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
