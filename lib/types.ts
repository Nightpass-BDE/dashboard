export type BdeStatus =
  | "à contacter"
  | "contacté"
  | "en discussion"
  | "partenariat signé";

export interface Bde {
  id: string;
  name: string;
  school: string;
  city: string;
  instagram: string;
  email: string;
  phone?: string;
  website?: string;
  followers: number;
  lastEventsDetected: { title: string; date: string }[];
  instagramActive: boolean;
  lastPostDate?: string;
  status: BdeStatus;
}
