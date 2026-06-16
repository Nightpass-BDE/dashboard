import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import data from "../data/bdes.json" with { type: "json" };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

for (const bde of data) {
  await prisma.bde.upsert({
    where: { id: bde.id },
    update: {},
    create: {
      id: bde.id,
      name: bde.name,
      school: bde.school,
      city: bde.city,
      instagram: bde.instagram ?? null,
      email: bde.email ?? null,
      phone: (bde as { phone?: string }).phone ?? null,
      website: (bde as { website?: string }).website ?? null,
      followers: bde.followers,
      lastEventsDetected: bde.lastEventsDetected,
      score: bde.score,
      status: bde.status,
    },
  });
  console.log("✓", bde.name);
}

await prisma.$disconnect();
console.log("Seed terminé !");
