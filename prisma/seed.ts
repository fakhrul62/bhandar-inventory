import { PrismaClient, PlanName } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.plan.upsert({
    where: { name: PlanName.FREE },
    update: { price: 0, productLimit: 50 },
    create: { name: PlanName.FREE, price: 0, productLimit: 50 },
  });

  await prisma.plan.upsert({
    where: { name: PlanName.PRO },
    update: { price: 499, productLimit: 500 },
    create: { name: PlanName.PRO, price: 499, productLimit: 500 },
  });

  await prisma.plan.upsert({
    where: { name: PlanName.MAX },
    update: { price: 999, productLimit: 1000 },
    create: { name: PlanName.MAX, price: 999, productLimit: 1000 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
