export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { BdeDashboard } from "@/components/BdeDashboard";
import type { Bde } from "@/lib/types";

type PrismaBde = Awaited<ReturnType<typeof prisma.bde.findFirst>>;

function rowToBde(row: NonNullable<PrismaBde>): Bde {
  return {
    id: row.id,
    name: row.name,
    school: row.school,
    city: row.city,
    instagram: row.instagram ?? "",
    email: row.email ?? "",
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    followers: row.followers,
    lastEventsDetected: row.lastEventsDetected as { title: string; date: string }[],
    instagramActive: row.instagramActive,
    lastPostDate: row.lastPostDate?.toISOString().split("T")[0] ?? undefined,
    status: row.status as Bde["status"],
  };
}

export default async function Page() {
  const rows = await prisma.bde.findMany({ orderBy: { name: "asc" } });
  return <BdeDashboard initialBdes={rows.map(rowToBde)} />;
}
