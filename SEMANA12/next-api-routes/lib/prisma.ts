// Prisma 8 ya no usa un PrismaClient singleton aqui: el runtime real vive en
// src/prisma/db.ts (emitido a partir de prisma/schema.prisma). Este archivo
// solo reexporta esa instancia para quien importe desde "@/lib/prisma".
import { db } from '../src/prisma/db';

export { db };
export default db;
