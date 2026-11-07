import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans en vez de Geist: trazo mas humano y calido para texto de
// interfaz (Geist se sentia demasiado geometrico/"robotico" para el tema).
const bodySans = Plus_Jakarta_Sans({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces: serif editorial para titulares, con caracter de libro impreso.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "La Biblioteca",
  description: "Explora, agrega y edita el catalogo de libros y autores.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${bodySans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
