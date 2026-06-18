# NightPass — Dashboard

Interface d'administration pour gérer les BDE partenaires : suivi du statut de prospection, score de partenariat, coordonnées, activité Instagram et événements détectés.

---

## Stack technique

| Outil | Usage |
|---|---|
| Next.js 16 (App Router) | Framework React SSR/SSG |
| React 19 | UI |
| TypeScript 5 | Typage |
| Tailwind CSS 4 | Styles utilitaires |
| Prisma 7 | ORM — accès base de données |
| PostgreSQL | Base de données |
| Supabase | Hébergement PostgreSQL + client JS |

---

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL=postgresql://...          # connexion Prisma (pooler Supabase)
DIRECT_URL=postgresql://...            # connexion directe pour les migrations
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...                # optionnel — service role (server-side)
```

---

## Base de données

### Schéma Prisma (`prisma/schema.prisma`)

```prisma
model Bde {
  id                 String    @id
  name               String
  school             String
  city               String
  instagram          String?
  email              String?
  phone              String?
  website            String?
  followers          Int       @default(0)
  lastEventsDetected Json      @default("[]")
  lastPostDate       DateTime? @map("last_post_date")
  instagramActive    Boolean   @default(false)
  score              Int       @default(0)
  status             String    @default("à contacter")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@map("bdes")
}
```

**Statuts disponibles** : `à contacter` · `contacté` · `en discussion` · `partenariat signé`

### Appliquer les migrations

```bash
npx prisma migrate dev
```

### Peupler la base avec les données de démo

```bash
npx tsx scripts/seed.mts
```

Lit `data/bdes.json` et upsert les entrées en base (création si inexistant, skip si déjà présent).

### Générer le client Prisma (après modification du schéma)

```bash
npx prisma generate
```

---

## Structure des composants

| Composant | Fichier | Rôle |
|---|---|---|
| **BdeDashboard** | `components/BdeDashboard.tsx` | Conteneur principal — gère tout l'état (filtres, tri, sélection, panel détail, dark mode) |
| **KpiCards** | `components/KpiCards.tsx` | 5 cartes de synthèse : total BDE + répartition par statut |
| **FilterBar** | `components/FilterBar.tsx` | Barre de recherche, filtres ville/école, boutons export CSV / nouveau BDE / refresh |
| **BdeTable** | `components/BdeTable.tsx` | Tableau triable avec cases à cocher, sélecteur de statut inline, boutons édition/détail |
| **BdeDetail** | `components/BdeDetail.tsx` | Panel latéral droit — détails complets d'un BDE, mode édition, liste d'événements |
| **BdeForm** | `components/BdeForm.tsx` | Modal de création d'un nouveau BDE |
| **StatusBadge** | `components/StatusBadge.tsx` | Badge coloré selon le statut de prospection |
| **ScoreBadge** | `components/ScoreBadge.tsx` | Badge score : vert ≥ 70 · orange ≥ 40 · rouge < 40 |
| **LightbulbToggle** | `components/LightbulbToggle.tsx` | Toggle dark/light mode avec ampoule animée |

---

## API Routes

### `GET /api/bdes`
Retourne tous les BDE triés par score décroissant.

**Réponse**
```json
[
  {
    "id": "bde-kedge-bordeaux",
    "name": "BDE KEDGE",
    "school": "KEDGE Business School",
    "city": "Bordeaux",
    "email": "bde@kedge.edu",
    "phone": "+33 5 56 84 55 55",
    "instagram": "@bde_kedge",
    "website": "https://bde.kedge.edu",
    "followers": 6800,
    "instagramActive": true,
    "lastPostDate": "2024-03-22",
    "lastEventsDetected": [{ "title": "Gala KEDGE 2024", "date": "2024-03-22" }],
    "score": 91,
    "status": "en discussion"
  }
]
```

---

### `POST /api/bdes`
Crée un nouveau BDE.

**Body**
```json
{
  "name": "BDE INSA",
  "school": "INSA Toulouse",
  "city": "Toulouse",
  "email": "bde@insa.fr",
  "phone": "05 61 ...",
  "instagram": "@bdeinsa",
  "website": "https://..."
}
```

**Réponses** : `201` objet BDE créé / `400` champs manquants / `500` erreur serveur

---

### `PATCH /api/bdes/[id]`
Met à jour les champs d'un BDE existant (mise à jour partielle).

**Body** — tous les champs sont optionnels :
```json
{
  "status": "partenariat signé",
  "email": "nouveau@email.fr",
  "score": 85
}
```

**Réponse** : `200` objet BDE mis à jour

---

## Build & déploiement

```bash
npm run build
npm run start
```

Compatible Vercel. Variables d'environnement à configurer dans le dashboard Vercel.
