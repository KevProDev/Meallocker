import { PrismaClient } from "@prisma/client";

// let prisma = new PrismaClient();

// if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
//   prisma = new PrismaClient();

// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

export default new PrismaClient();
