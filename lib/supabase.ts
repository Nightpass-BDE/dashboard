import { createClient } from "@supabase/supabase-js";
import type { Bde } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type BdeRow = Omit<Bde, "lastEventsDetected"> & {
  last_events_detected: { title: string; date: string }[];
};

export function rowToBde(row: BdeRow): Bde {
  return {
    id: row.id,
    name: row.name,
    school: row.school,
    city: row.city,
    instagram: row.instagram,
    email: row.email,
    phone: row.phone,
    website: row.website,
    followers: row.followers,
    lastEventsDetected: row.last_events_detected ?? [],
    instagramActive: row.instagramActive ?? false,
    lastPostDate: row.lastPostDate ?? undefined,
    status: row.status,
  };
}
