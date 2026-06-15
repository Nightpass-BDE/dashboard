import type { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Bde } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "data", "bdes.json");

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const bdes: Bde[] = JSON.parse(raw);

  const index = bdes.findIndex((b) => b.id === id);
  if (index === -1) {
    return Response.json({ error: "BDE not found" }, { status: 404 });
  }

  bdes[index] = { ...bdes[index], ...body };
  await fs.writeFile(DATA_PATH, JSON.stringify(bdes, null, 2), "utf-8");

  return Response.json(bdes[index]);
}
