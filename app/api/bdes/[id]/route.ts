import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import type { Bde } from "@/lib/types";

type PrismaBde = NonNullable<Awaited<ReturnType<typeof prisma.bde.findFirst>>>;

function rowToBde(row: PrismaBde): Bde {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const row = await prisma.bde.update({ where: { id }, data: body });
  return Response.json(rowToBde(row));
}
