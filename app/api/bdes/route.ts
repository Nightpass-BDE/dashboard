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
    score: row.score,
    status: row.status as Bde["status"],
  };
}

export async function GET() {
  const rows = await prisma.bde.findMany({ orderBy: { score: "desc" } });
  return Response.json(rows.map(rowToBde));
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = `bde-${Date.now()}`;

  const row = await prisma.bde.create({
    data: {
      id,
      name: body.name,
      school: body.school,
      city: body.city,
      email: body.email || null,
      phone: body.phone || null,
      instagram: body.instagram || null,
      website: body.website || null,
      followers: 0,
      lastEventsDetected: [],
      score: 0,
      status: "à contacter",
    },
  });

  return Response.json(rowToBde(row), { status: 201 });
}
