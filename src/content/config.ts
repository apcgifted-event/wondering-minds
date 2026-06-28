import { defineCollection, z } from 'astro:content';

// ---------------------------------------------------------------------------
// REEL — "Voices from Europe"
// Modello ibrido deciso in fase di progettazione:
//  - source 'embed'  -> post social gia pubblico e approvato (Instagram/TikTok/YouTube)
//  - source 'upload'  -> video ospitato da noi (es. video genitori raccolti via Drive)
// In entrambi i casi il contenuto entra SOLO dopo selezione del team e con
// liberatoria immagini/video del minore gia firmata e archiviata fuori dal sito.
// ---------------------------------------------------------------------------
const reels = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),                 // nome di battesimo (no cognome) del/la protagonista
    age: z.number().int().min(6).max(18),
    country: z.string(),              // es. "Italy"
    countryCode: z.string().length(2),// es. "it" per la bandiera
    source: z.enum(['embed', 'upload']),
    // se source = embed:
    embedUrl: z.string().url().optional(),     // URL del post social pubblico
    platform: z.enum(['instagram', 'tiktok', 'youtube']).optional(),
    // se source = upload:
    videoUrl: z.string().optional(),           // path/URL del file ospitato
    posterUrl: z.string().optional(),          // immagine di anteprima
    // comune:
    consentOnFile: z.boolean().default(false), // liberatoria firmata archiviata? gate di pubblicazione
    published: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// ---------------------------------------------------------------------------
// NEWS & UPDATES
// ---------------------------------------------------------------------------
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    cover: z.string().optional(),
    published: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------------
// ASSOCIAZIONI PARTNER
// La partecipazione partner prevede menzione di nome e logo (vedi lettera C4C).
// L'uso del logo richiede autorizzazione: 'logoAuthorized' e il gate.
// ---------------------------------------------------------------------------
const associations = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    website: z.string().url().optional(),
    logo: z.string().optional(),
    logoAuthorized: z.boolean().default(false),
    published: z.boolean().default(false),
  }),
});

export const collections = { reels, news, associations };
