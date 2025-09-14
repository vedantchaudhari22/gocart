
// import { PrismaClient } from '@prisma/client';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { neonConfig } from '@neondatabase/serverless';

// import ws from 'ws';
// neonConfig.webSocketConstructor = ws;

// // To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
//  neonConfig.poolQueryViaFetch = true

// // Type definitions
// // declare global {
// //   var prisma: PrismaClient | undefined
// // }

// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaNeon({ connectionString });
// const prisma = global.prisma || new PrismaClient({ adapter });

// if (process.env.NODE_ENV === 'development') global.prisma = prisma;

// export default prisma;  


import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'

// Use fetch pooling (works both locally & on Vercel)
neonConfig.poolQueryViaFetch = true

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaNeon({ connectionString })

// Cache Prisma instance in dev (prevents multiple client warnings)
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter })
  }
  prisma = global.prisma
}

export default prisma
