import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "bdes.json");

export async function GET() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return Response.json(JSON.parse(raw));
}
