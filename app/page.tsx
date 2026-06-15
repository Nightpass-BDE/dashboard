import fs from "fs/promises";
import path from "path";
import type { Bde } from "@/lib/types";
import { BdeDashboard } from "@/components/BdeDashboard";

export default async function Page() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "bdes.json"),
    "utf-8"
  );
  const bdes: Bde[] = JSON.parse(raw);

  return <BdeDashboard initialBdes={bdes} />;
}
